import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import fs from "fs"
import path from "path"

export async function POST(request) {
  try {
    // Read the schema SQL file
    const schemaFilePath = path.join(process.cwd(), "schema.sql")
    const schemaSql = fs.readFileSync(schemaFilePath, "utf8")

    // Execute the schema SQL
    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Split the schema SQL by semicolons to execute each statement
      const statements = schemaSql
        .split(";")
        .filter((statement) => statement.trim() !== "")
        .map((statement) => statement.trim() + ";")

      for (const statement of statements) {
        await client.query(statement)
      }

      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }

    return NextResponse.json({
      success: true,
      message: "Database schema initialized successfully",
    })
  } catch (error) {
    console.error("Error initializing database schema:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
