import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await query('SELECT * FROM "PlanType" ORDER BY id')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("❌ Error fetching plan types:", error)
    return NextResponse.json({ error: "Failed to fetch plan types" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name } = body

    const result = await query(
      'INSERT INTO "PlanType" (name) VALUES ($1) RETURNING *',
      [name]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("❌ Error adding plan type:", error)
    return NextResponse.json({ error: "Failed to add plan type" }, { status: 500 })
  }
}
