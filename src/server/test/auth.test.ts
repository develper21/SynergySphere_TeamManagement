// @vitest-environment node

import express from "express";
import jwt from "jsonwebtoken";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { authenticateToken } from "../middleware/auth.js";
import type { AuthenticatedRequest } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const user = {
  id: "user-123",
  email: "member@example.com",
  name: "Team Member",
  role: "member",
};

let server: Server;
let protectedUrl: string;

beforeAll(async () => {
  const app = express();
  app.get("/protected", authenticateToken, (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  });

  server = app.listen(0);
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not determine the test server address");
  }

  protectedUrl = `http://127.0.0.1:${address.port}/protected`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe("authenticateToken", () => {
  it("rejects requests with no authorization token", async () => {
    const response = await fetch(protectedUrl);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Access token required",
    });
  });

  it("requires the Bearer authorization scheme", async () => {
    const token = jwt.sign(user, JWT_SECRET);
    const response = await fetch(protectedUrl, {
      headers: { Authorization: `Basic ${token}` },
    });

    expect(response.status).toBe(401);
  });

  it.each([
    ["an invalid token", "not-a-jwt"],
    ["an expired token", jwt.sign(user, JWT_SECRET, { expiresIn: -1 })],
  ])("rejects %s", async (_description, token) => {
    const response = await fetch(protectedUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Invalid or expired token",
    });
  });

  it("accepts a valid Bearer token and exposes its user claims", async () => {
    const token = jwt.sign(user, JWT_SECRET);
    const response = await fetch(protectedUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ user });
  });
});
