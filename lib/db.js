// lib/db.js

import { Pool } from "pg"
import dotenv from "dotenv"

// Load variables from .env into process.env
dotenv.config()

// Validate database URL
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL not set in environment variables")
}

// Create the pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Query helper
export async function query(text, params = []) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}
