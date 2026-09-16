import { Router } from "express";
import { db } from "../db/index.js";
import { notifications } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth.js";
import { AuthenticatedRequest } from "../types/index.js";

const router = Router();

// Get all notifications for current user
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, req.user!.id),
      orderBy: [notifications.createdAt],
    });

    res.json({
      success: true,
      data: userNotifications,
    });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put("/:id/read", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const notificationId = req.params.id as string;

    const [notification] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notificationId))
      .returning();

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
router.put("/read-all", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.userId, req.user!.id), eq(notifications.read, false)));

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
});

// Delete notification
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const notificationId = req.params.id as string;

    const notification = await db.query.notifications.findFirst({
      where: eq(notifications.id, notificationId),
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    if (notification.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    await db.delete(notifications).where(eq(notifications.id, notificationId));

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
