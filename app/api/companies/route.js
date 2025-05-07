import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT * FROM company")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("❌ Error fetching companies:", error)
    return NextResponse.json({ error: "Failed to load companies" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    if (!data.name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    const result = await query(
      "INSERT INTO company (name, active) VALUES ($1, $2) RETURNING *",
      [data.name, data.active ?? true]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("❌ Error creating company:", error)
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 })
  }
}
