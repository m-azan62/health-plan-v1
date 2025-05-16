import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// PUT: Update question
export async function PUT(request, context) {
  try {
    const id = parseInt(context.params.id); // ✅ Access params from context
    const body = await request.json();
    const { text, active, companyId } = body;

    if (!text || companyId === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await query(
      `UPDATE "Question"
       SET text = $1, active = $2, "companyId" = $3
       WHERE id = $4
       RETURNING *`,
      [text, active ?? true, companyId, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error updating question:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

// DELETE: Delete question
export async function DELETE(request, context) {
  try {
    const id = parseInt(context.params.id); // ✅ Same fix
    await query(`DELETE FROM "Question" WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting question:", error);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}
