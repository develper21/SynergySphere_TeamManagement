import { Router } from "express";
import { db } from "../db/index.js";
import { projects, tasks, projectMembers, activities, users } from "../db/schema.js";
import { eq, and, desc, count, inArray, gte } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth.js";
import { AuthenticatedRequest } from "../types/index.js";

const router = Router();

// Get dashboard stats
router.get("/stats", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const isAdmin = req.user!.role === "admin";

    // Active projects count
    let activeProjects = 0;
    if (isAdmin) {
      const activeRes = await db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.status, "active"));
      activeProjects = activeRes[0]?.count || 0;
    } else {
      const activeRes = await db
        .select({ count: count() })
        .from(projects)
        .innerJoin(
          projectMembers,
          and(
            eq(projects.id, projectMembers.projectId),
            eq(projectMembers.userId, userId)
          )
        )
        .where(eq(projects.status, "active"));
      activeProjects = activeRes[0]?.count || 0;
    }

    // Tasks completed count
    let tasksCompleted = 0;
    let totalTasks = 0;
    if (isAdmin) {
      const completedRes = await db
        .select({ count: count() })
        .from(tasks)
        .where(eq(tasks.status, "done"));
      tasksCompleted = completedRes[0]?.count || 0;

      const totalRes = await db.select({ count: count() }).from(tasks);
      totalTasks = totalRes[0]?.count || 0;
    } else {
      const completedRes = await db
        .select({ count: count() })
        .from(tasks)
        .innerJoin(
          projectMembers,
          and(
            eq(tasks.projectId, projectMembers.projectId),
            eq(projectMembers.userId, userId)
          )
        )
        .where(eq(tasks.status, "done"));
      tasksCompleted = completedRes[0]?.count || 0;

      const totalRes = await db
        .select({ count: count() })
        .from(tasks)
        .innerJoin(
          projectMembers,
          and(
            eq(tasks.projectId, projectMembers.projectId),
            eq(projectMembers.userId, userId)
          )
        );
      totalTasks = totalRes[0]?.count || 0;
    }

    // Team members count
    let teamMembers = 0;
    if (isAdmin) {
      const membersRes = await db.select({ count: count() }).from(users);
      teamMembers = membersRes[0]?.count || 0;
    } else {
      const userProjectRows = await db
        .select({ projectId: projectMembers.projectId })
        .from(projectMembers)
        .where(eq(projectMembers.userId, userId));
      const userPids = userProjectRows.map((r) => r.projectId);

      if (userPids.length > 0) {
        const membersRes = await db
          .select({ count: count() })
          .from(projectMembers)
          .where(inArray(projectMembers.projectId, userPids));
        teamMembers = membersRes[0]?.count || 0;
      }
    }

    const productivity = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        activeProjects,
        tasksCompleted,
        teamMembers,
        productivity,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get weekly task activity
router.get("/weekly-activity", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const isAdmin = req.user!.role === "admin";

    // Get tasks from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let taskQuery;
    if (isAdmin) {
      taskQuery = db
        .select()
        .from(tasks)
        .where(gte(tasks.createdAt, sevenDaysAgo));
    } else {
      taskQuery = db
        .select()
        .from(tasks)
        .innerJoin(
          projectMembers,
          and(
            eq(tasks.projectId, projectMembers.projectId),
            eq(projectMembers.userId, userId)
          )
        )
        .where(gte(tasks.createdAt, sevenDaysAgo));
    }

    const allTasks = await taskQuery;

    // Group by day of week
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = days.map(day => ({
      day,
      tasks: 0,
      hours: 0,
    }));

    allTasks.forEach(task => {
      const taskDate = new Date(task.createdAt);
      const dayName = days[taskDate.getDay()];
      const dayData = weeklyData.find(d => d.day === dayName);
      if (dayData) {
        dayData.tasks += 1;
        // Estimate hours based on task count (1 task = ~1 hour average)
        dayData.hours += 1;
      }
    });

    res.json({
      success: true,
      data: weeklyData,
    });
  } catch (error) {
    next(error);
  }
});

// Get recent activities
router.get("/activities", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const memberships = await db.query.projectMembers.findMany({
      where: eq(projectMembers.userId, userId),
    });
    const projectIds = memberships.map((m) => m.projectId);

    const recentActivities = await db.query.activities.findMany({
      where: and(
        eq(activities.userId, userId),
        projectIds.length > 0 ? eq(activities.projectId, projectIds[0]) : undefined
      ),
      orderBy: [desc(activities.createdAt)],
      limit: 10,
    });

    const formattedActivities = await Promise.all(
      recentActivities.map(async (activity) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, activity.userId),
        });
        const project = activity.projectId
          ? await db.query.projects.findFirst({
              where: eq(projects.id, activity.projectId),
            })
          : null;

        const meta = activity.metadata ? JSON.parse(activity.metadata) : {};
        const task = meta.taskTitle || meta.projectName || meta.title || "";

        return {
          id: activity.id,
          user: user?.name || "Unknown User",
          project: project?.name || "Unknown Project",
          action: activity.action,
          task,
          time: activity.createdAt,
        };
      })
    );

    res.json({
      success: true,
      data: formattedActivities,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
