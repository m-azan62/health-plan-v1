// app/api/medications/route.js
import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export const runtime = "nodejs" // Ensures it runs in Node.js, not Edge

// GET all medications
export async function GET() {
  try {
    const result = await query('SELECT * FROM "Medication" ORDER BY id DESC')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("❌ Error fetching medications:", error)
    return NextResponse.json(
      { error: "Failed to load medications" },
      { status: 500 }
    )
  }
}

// POST new medication
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, description, active, tags, alternatives } = body

    const result = await query(
      `INSERT INTO "Medication" (name, description, active, tags, alternatives)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name,
        description || "",
        active ?? true,
        JSON.stringify(tags ?? []),
        JSON.stringify(alternatives ?? []),
      ]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("❌ Error adding medication:", error)
    return NextResponse.json(
      { error: "Failed to add medication" },
      { status: 500 }
    )
  }
}
