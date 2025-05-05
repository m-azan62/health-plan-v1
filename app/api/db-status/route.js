import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  let client = null
  try {
    // Check if we're on the server
    if (typeof window !== "undefined") {
      return NextResponse.json({
        status: "error",
        message: "This endpoint can only be called from the server",
      })
    }

    // Check if pool is initialized
    if (!pool) {
      return NextResponse.json({
        status: "error",
        message: "Database pool is not initialized",
        env: {
          POSTGRES_URL: process.env.POSTGRES_URL ? "Set" : "Not set",
          NODE_ENV: process.env.NODE_ENV,
        },
      })
    }

    // Try to connect to the database
    client = await pool.connect()

    // Run a simple query
    const result = await client.query("SELECT NOW()")

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      timestamp: result.rows[0].now,
      env: {
        POSTGRES_URL: process.env.POSTGRES_URL ? "Set" : "Not set",
        NODE_ENV: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    console.error("Database connection error:", error)

    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
      env: {
        POSTGRES_URL: process.env.POSTGRES_URL ? "Set" : "Not set",
        NODE_ENV: process.env.NODE_ENV,
      },
    })
  } finally {
    if (client) client.release()
  }
}
