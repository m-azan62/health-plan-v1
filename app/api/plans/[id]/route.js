import { query } from "@/lib/db"
import { NextResponse } from "next/server"

// PUT: Update a plan
export async function PUT(request, context) {
  try {
    const { params } = context
    const id = parseInt(params.id)

    const body = await request.json()
    const { name, companyId, planTypeId, stateIds, active } = body

    const result = await query(
      `UPDATE "Plan"
       SET name = $1,
           "companyId" = $2,
           "planTypeId" = $3,
           "stateIds" = $4,
           active = $5
       WHERE id = $6
       RETURNING *`,
      [name, companyId, planTypeId, JSON.stringify(stateIds), active, id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("❌ Error updating plan:", error)
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 })
  }
}

// DELETE: Delete a plan
export async function DELETE(_, context) {
  try {
    const { params } = context
    const id = parseInt(params.id)

    await query('DELETE FROM "Plan" WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error deleting plan:", error)
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 })
  }
}
