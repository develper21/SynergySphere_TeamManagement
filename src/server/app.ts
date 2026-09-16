import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
if (!process.env.DATABASE_URL) {
  const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  if (!process.env.DATABASE_URL) {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  }
}

// Import routes
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import taskRoutes from "./routes/tasks";
import memberRoutes from "./routes/members";
import discussionRoutes from "./routes/discussions";
import notificationRoutes from "./routes/notifications";
import dashboardRoutes from "./routes/dashboard";

// Import middleware
import { errorHandler, notFoundHandler } from "./middleware/error";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // In development, allow localhost
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      // In production, check FRONTEND_URL or allow vercel deployments
      const configuredOrigins = process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
        : [];

      if (
        configuredOrigins.length === 0 ||
        configuredOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get(["/health", "/api/health"], (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes setup
const apiRouter = express.Router();
apiRouter.use("/auth", authRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/tasks", taskRoutes);
apiRouter.use("/members", memberRoutes);
apiRouter.use("/discussions", discussionRoutes);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/dashboard", dashboardRoutes);

// Mount under both /api and root to guarantee compatibility with rewrites
app.use("/api", apiRouter);
app.use(apiRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
