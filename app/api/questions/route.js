// app/api/questions/route.js
import { query } from "@/lib/db"
import { NextResponse } from "next/server"

// GET: Get all questions
export async function GET() {
  try {
    const result = await query(`
      SELECT q.*, c.name AS companyName 
      FROM "Question" q 
      JOIN "Company" c ON q."companyId" = c.id
      ORDER BY q.id DESC
    `)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("❌ Error fetching questions:", error)
    return NextResponse.json({ error: "Failed to load questions" }, { status: 500 })
  }
}

// POST: Add new question
export async function POST(request) {
  try {
    const body = await request.json()
    const { text, active, companyId } = body

    if (!text || companyId === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO "Question" (text, active, "companyId") VALUES ($1, $2, $3) RETURNING *`,
      [text, active ?? true, companyId]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("❌ Error adding question:", error)
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 })
  }
}
