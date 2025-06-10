import * as dotenv from "dotenv"
import { defineConfig } from "drizzle-kit"

dotenv.config({ path: ".env.local" })

export default defineConfig({
  schema: "./db/schema",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.AUTH_DRIZZLE_URL as string },
  verbose: true,
  strict: true,
  schemaFilter: ["public"],
})
