import { query } from "@/lib/db"
import { NextResponse } from "next/server"

// PUT: Update PlanType
export async function PUT(request, context) {
  try {
    const { id } = await context.params; // ✅ Await params
    const parsedId = parseInt(id, 10)

    const body = await request.json()
    const { name } = body

    const result = await query(
      'UPDATE "PlanType" SET name = $1 WHERE id = $2 RETURNING *',
      [name, parsedId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "PlanType not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("❌ Error updating plan type:", error)
    return NextResponse.json({ error: "Failed to update plan type" }, { status: 500 })
  }
}

// DELETE: Delete PlanType
export async function DELETE(_, context) {
  try {
    const { id } = await context.params; // ✅ Await params
    const parsedId = parseInt(id, 10)

    const result = await query('DELETE FROM "PlanType" WHERE id = $1 RETURNING *', [parsedId])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "PlanType not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error deleting plan type:", error)
    return NextResponse.json({ error: "Failed to delete plan type" }, { status: 500 })
  }
}
