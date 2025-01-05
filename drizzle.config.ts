import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./lib/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.AUTH_DRIZZLE_URL as string },
  verbose: true,
  strict: true,
  schemaFilter: ["public"],
});
