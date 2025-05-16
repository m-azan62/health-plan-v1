import { query } from "@/lib/db"
import { NextResponse } from "next/server"

// GET: Fetch all states
export async function GET() {
  try {
    const result = await query('SELECT * FROM "State" ORDER BY id')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("❌ Error fetching states:", error)
    return NextResponse.json({ error: "Failed to fetch states" }, { status: 500 })
  }
}

// POST: Create a new state
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, short } = body

    // Validate input
    if (!name || typeof name !== "string" || !short || typeof short !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const result = await query(
      'INSERT INTO "State" (name, short) VALUES ($1, $2) RETURNING *',
      [name, short]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("❌ Error creating state:", error)
    return NextResponse.json({ error: "Failed to create state" }, { status: 500 })
  }
}
