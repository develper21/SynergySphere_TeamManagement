import { Router } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { projects, projectMembers, tasks } from "../db/schema.js";
import { eq, and, desc, inArray } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth.js";
import { AuthenticatedRequest } from "../types/index.js";

const router = Router();

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().datetime().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["active", "completed", "archived"]).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

// Get all projects for current user
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userMemberships = await db.query.projectMembers.findMany({
      where: eq(projectMembers.userId, req.user!.id),
    });
    const userProjectIds = userMemberships.map((m) => m.projectId);

    let userProjects;
    if (req.user!.role === "admin") {
      userProjects = await db.query.projects.findMany({
        with: {
          members: true,
        },
        orderBy: [desc(projects.createdAt)],
      });
    } else if (userProjectIds.length > 0) {
      userProjects = await db.query.projects.findMany({
        where: inArray(projects.id, userProjectIds),
        with: {
          members: true,
        },
        orderBy: [desc(projects.createdAt)],
      });
    } else {
      userProjects = await db.query.projects.findMany({
        where: eq(projects.createdBy, req.user!.id),
        with: {
          members: true,
        },
        orderBy: [desc(projects.createdAt)],
      });
    }

    const formattedProjects = await Promise.all(
      userProjects.map(async (project) => {
        const memberCount = project.members?.length || 0;
        const taskList = await db.query.tasks.findMany({
          where: eq(tasks.projectId, project.id),
        });
        const completedTaskCount = taskList.filter((t) => t.status === "done").length;

        return {
          id: project.id,
          name: project.name,
          description: project.description,
          priority: project.priority,
          status: project.status,
          dueDate: project.dueDate,
          createdBy: project.createdBy,
          members: memberCount,
          tasks: {
            total: taskList.length,
            done: completedTaskCount,
          },
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
      })
    );

    res.json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    next(error);
  }
});

// Get single project
router.get("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.params.id as string;

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

// Create project
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { name, description, priority, dueDate } = createProjectSchema.parse(req.body);

    const [newProject] = await db
      .insert(projects)
      .values({
        name,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "active",
        createdBy: req.user!.id,
      })
      .returning();

    await db.insert(projectMembers).values({
      projectId: newProject.id,
      userId: req.user!.id,
      role: "manager",
    });

    res.status(201).json({
      success: true,
      data: newProject,
    });
  } catch (error) {
    next(error);
  }
});

// Update project
router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.params.id as string;
    const updates = updateProjectSchema.parse(req.body);

    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership || membership.role !== "manager") {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const updateData = {
      ...updates,
      dueDate: updates.dueDate ? new Date(updates.dueDate) : updates.dueDate === null ? null : undefined,
    };

    const [updatedProject] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, projectId))
      .returning();

    res.json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
});

// Delete project
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.params.id as string;

    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership || membership.role !== "manager") {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    await db.delete(projects).where(eq(projects.id, projectId));

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
