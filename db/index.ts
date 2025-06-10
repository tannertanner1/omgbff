import * as schema from "@/db/schema"
import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"
import { drizzle } from "drizzle-orm/neon-http"

dotenv.config({ path: ".env.local" })

if (!process.env.AUTH_DRIZZLE_URL) {
  throw new Error(
    "AUTH_DRIZZLE_URL environment variable is not set. Please set this in your .env.local file or in your Vercel project settings."
  )
}

const sql = neon(process.env.AUTH_DRIZZLE_URL)
export const db = drizzle(sql, { schema })
