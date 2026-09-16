import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};
