import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { projectMembers, users, projects, notifications } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";

const router = Router();

// Validation schemas
const inviteMemberSchema = z.object({
  projectId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["admin", "manager", "member"]).default("member"),
});

const updateRoleSchema = z.object({
  role: z.enum(["admin", "manager", "member"]),
});

// Get all members (optionally filtered by project)
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.query.projectId as string | undefined;

    let members;
    if (projectId) {
      members = await db.query.projectMembers.findMany({
        where: eq(projectMembers.projectId, projectId),
        with: {
          user: true,
        },
      });
    } else {
      members = await db.query.projectMembers.findMany({
        with: {
          user: true,
        },
      });
    }

    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
});

// Invite member
router.post("/invite", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { projectId, email, role } = inviteMemberSchema.parse(req.body);

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const existingMember = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, user.id)
      ),
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: "User is already a member",
      });
    }

    const [newMember] = await db
      .insert(projectMembers)
      .values({
        projectId,
        userId: user.id,
        role,
      })
      .returning();

    // Create notification
    await db.insert(notifications).values({
      userId: user.id,
      type: "invite",
      title: "Project Invitation",
      description: `You have been invited to join a project`,
      actionable: true,
      relatedId: projectId,
    });

    res.status(201).json({
      success: true,
      data: newMember,
    });
  } catch (error) {
    next(error);
  }
});

// Update member role
router.put("/:id/role", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const memberId = req.params.id as string;
    const { role } = updateRoleSchema.parse(req.body);

    const member = await db.query.projectMembers.findFirst({
      where: eq(projectMembers.id, memberId),
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        error: "Member not found",
      });
    }

    const [updatedMember] = await db
      .update(projectMembers)
      .set({ role })
      .where(eq(projectMembers.id, memberId))
      .returning();

    res.json({
      success: true,
      data: updatedMember,
    });
  } catch (error) {
    next(error);
  }
});

// Remove member
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const memberId = req.params.id as string;

    const member = await db.query.projectMembers.findFirst({
      where: eq(projectMembers.id, memberId),
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        error: "Member not found",
      });
    }

    await db.delete(projectMembers).where(eq(projectMembers.id, memberId));

    res.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
