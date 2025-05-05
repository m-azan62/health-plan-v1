import { Pool } from "pg"

let pool

// This code will only run on the server
if (typeof window === "undefined") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  })
}

// Helper function to execute queries (server-side only)
async function query(text, params = []) {
  if (typeof window !== "undefined") {
    throw new Error("Database queries can only be executed on the server")
  }

  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}
