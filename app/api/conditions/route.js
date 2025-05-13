import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET all conditions
export async function GET() {
  try {
    const result = await query('SELECT * FROM "HealthCondition" ORDER BY id DESC')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("❌ Error fetching health conditions:", error)
    return NextResponse.json({ error: "Failed to fetch conditions" }, { status: 500 })
  }
}

// POST new condition
export async function POST(req) {
  try {
    const body = await req.json()
    const { name, description, active, tags = [], alternatives = [] } = body

    const result = await query(
      `INSERT INTO "HealthCondition" (name, description, active, tags, alternatives)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, active, JSON.stringify(tags), JSON.stringify(alternatives)]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("❌ Error creating condition:", error)
    return NextResponse.json({ error: "Failed to create condition" }, { status: 500 })
  }
}
