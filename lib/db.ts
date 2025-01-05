import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.AUTH_DRIZZLE_URL) {
  throw new Error(
    "AUTH_DRIZZLE_URL environment variable is not set. Please set this in your .env.local file or in your Vercel project settings.",
  );
}

const sql = neon(process.env.AUTH_DRIZZLE_URL);
export const db = drizzle(sql, { schema });
