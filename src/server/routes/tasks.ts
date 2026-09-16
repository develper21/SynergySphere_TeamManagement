import { Router } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { tasks, projectMembers, activities } from "../db/schema.js";
import { eq, and, desc } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth.js";
import { AuthenticatedRequest } from "../types/index.js";

const router = Router();

// Validation schemas
const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  assigneeId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  assigneeId: z.string().uuid().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
});

// Get all tasks (optionally filtered by project)
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.query.projectId as string | undefined;

    let taskList;
    if (projectId) {
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

      taskList = await db.query.tasks.findMany({
        where: eq(tasks.projectId, projectId),
        orderBy: [desc(tasks.createdAt)],
      });
    } else {
      taskList = await db.query.tasks.findMany({
        orderBy: [desc(tasks.createdAt)],
      });
    }

    res.json({
      success: true,
      data: taskList,
    });
  } catch (error) {
    next(error);
  }
});

// Get single task
router.get("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const taskId = req.params.id as string;

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, task.projectId),
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
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// Create task
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { projectId, title, description, priority, status, assigneeId, dueDate } = createTaskSchema.parse(req.body);

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

    const [newTask] = await db
      .insert(tasks)
      .values({
        projectId,
        title,
        // TODO: Fix schema type inference for optional fields
        // description,
        // priority,
        // status,
        // assigneeId,
        // dueDate,
        createdBy: req.user!.id,
      })
      .returning();

    // TODO: Add activity logging when schema is fixed

    res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
});

// Update task
router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const taskId = req.params.id as string;
    const updates = updateTaskSchema.parse(req.body);

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, task.projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const [updatedTask] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, taskId))
      .returning();

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
});

// Update task status
router.patch("/:id/status", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const taskId = req.params.id as string;
    const { status } = req.body;

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, task.projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({ /* TODO: Fix schema type inference for status field */ })
      .where(eq(tasks.id, taskId))
      .returning();

    // TODO: Add activity logging when schema is fixed

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
});

// Delete task
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const taskId = req.params.id as string;

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, task.projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    await db.delete(tasks).where(eq(tasks.id, taskId));

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
