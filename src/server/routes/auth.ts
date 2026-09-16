import { Router } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "30d") as jwt.SignOptions["expiresIn"];

const router = Router();

// Validation schemas
const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const updateProfileSchema = z.object({
  name: z.string().min(2),
});

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = registerSchema.parse(req.body);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    const [newUser] = await db
      .insert(users)
      .values({
        name: fullName,
        email,
        passwordHash: password,
      })
      .returning();

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatarUrl: newUser.avatarUrl,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || user.passwordHash !== password) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get("/me", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user!.id),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put("/profile", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { name } = updateProfileSchema.parse(req.body);

    const [updatedUser] = await db
      .update(users)
      .set({ name })
      .where(eq(users.id, req.user!.id))
      .returning();

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Upload avatar
router.post("/avatar", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    // In production, upload to Cloudinary or similar service
    // For now, just return success without updating avatarUrl
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, req.user!.id),
    });

    res.json({
      success: true,
      data: {
        id: updatedUser!.id,
        name: updatedUser!.name,
        email: updatedUser!.email,
        role: updatedUser!.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
