import { query } from "@/lib/db"
import { NextResponse } from "next/server"

// PUT: Update a state
export async function PUT(request, { params }) {
  try {
    const id = params.id
    const body = await request.json()
    const { name } = body

    const result = await query(
      'UPDATE "State" SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("❌ Error updating state:", error)
    return NextResponse.json({ error: "Failed to update state" }, { status: 500 })
  }
}

// DELETE: Delete a state
export async function DELETE(_, { params }) {
  try {
    const id = params.id

    await query('DELETE FROM "State" WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error deleting state:", error)
    return NextResponse.json({ error: "Failed to delete state" }, { status: 500 })
  }
}
