import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/index.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error:", err);

  const response: ApiResponse = {
    success: false,
    error: err.message || "Internal Server Error",
  };

  res.status(500).json(response);
};

export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const response: ApiResponse = {
    success: false,
    error: "Route not found",
  };

  res.status(404).json(response);
};
