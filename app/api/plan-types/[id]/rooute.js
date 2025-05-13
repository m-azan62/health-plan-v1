import { query } from "@/lib/db"
import { NextResponse } from "next/server"

// PUT: Update PlanType
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { name } = body

    const result = await query(
      'UPDATE "PlanType" SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("❌ Error updating plan type:", error)
    return NextResponse.json({ error: "Failed to update plan type" }, { status: 500 })
  }
}

// DELETE: Delete PlanType
export async function DELETE(_, { params }) {
  try {
    const id = parseInt(params.id)

    await query('DELETE FROM "PlanType" WHERE id = $1', [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error deleting plan type:", error)
    return NextResponse.json({ error: "Failed to delete plan type" }, { status: 500 })
  }
}
