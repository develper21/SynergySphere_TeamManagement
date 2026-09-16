import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import path from "path";

if (!process.env.DATABASE_URL) {
  const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  if (!process.env.DATABASE_URL) {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  }
}

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://synergysphere_user:synergysphere123@localhost:5432/synergysphere",
  },
});
