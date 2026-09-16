import dotenv from "dotenv";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  if (!process.env.DATABASE_URL) {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  }
}

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://synergysphere_user:synergysphere123@localhost:5432/synergysphere";

const isSsl =
  connectionString.includes("neon.tech") ||
  connectionString.includes("sslmode=require") ||
  process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString,
  ssl: isSsl ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;
