import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// PUT: Update medication
export async function PUT(request, context) {
  try {
    const { id } = await context.params; // ✅ FIXED: await context.params
    const parsedId = parseInt(id);
    const body = await request.json();
    const { name, description, active, tags = [], alternatives = [] } = body;

    const result = await query(
      `UPDATE "Medication"
       SET name = $1, description = $2, active = $3, tags = $4, alternatives = $5
       WHERE id = $6 RETURNING *`,
      [name, description, active, JSON.stringify(tags), JSON.stringify(alternatives), parsedId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error updating medication:", error);
    return NextResponse.json({ error: "Failed to update medication" }, { status: 500 });
  }
}

// DELETE: Delete medication
export async function DELETE(_, context) {
  try {
    const { id } = await context.params; // ✅ FIXED: await context.params
    const parsedId = parseInt(id);
    await query('DELETE FROM "Medication" WHERE id = $1', [parsedId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting medication:", error);
    return NextResponse.json({ error: "Failed to delete medication" }, { status: 500 });
  }
}
