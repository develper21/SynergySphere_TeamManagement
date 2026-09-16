import { Router } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { discussions, projectMembers, users, projects } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth.js";
import { AuthenticatedRequest } from "../types/index.js";

const router = Router();

// Validation schemas
const sendMessageSchema = z.object({
  projectId: z.string().uuid(),
  content: z.string().min(1),
});

// Get discussions for a project
router.get("/:projectId", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.params.projectId as string;

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

    const projectDiscussions = await db.query.discussions.findMany({
      where: eq(discussions.projectId, projectId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: [discussions.createdAt],
    });

    res.json({
      success: true,
      data: projectDiscussions,
    });
  } catch (error) {
    next(error);
  }
});

// Send message
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { projectId, content } = sendMessageSchema.parse(req.body);

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

    const [discussion] = await db
      .insert(discussions)
      .values({
        projectId,
        userId: req.user!.id,
        content,
      })
      .returning();

    const populatedDiscussion = await db.query.discussions.findFirst({
      where: eq(discussions.id, discussion.id),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: populatedDiscussion,
    });
  } catch (error) {
    next(error);
  }
});

// Delete message
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const discussionId = req.params.id as string;

    const discussion = await db.query.discussions.findFirst({
      where: eq(discussions.id, discussionId),
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, discussion.projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership || (discussion.userId !== req.user!.id && membership.role !== "manager")) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    await db.delete(discussions).where(eq(discussions.id, discussionId));

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
