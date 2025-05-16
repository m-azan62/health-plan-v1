import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// PUT: Update a state
export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const parsedId = parseInt(id);
    const body = await request.json();
    const { name, short } = body;

    if (!name || !short) {
      return NextResponse.json({ error: "Name and short are required" }, { status: 400 });
    }

    const result = await query(
      'UPDATE "State" SET name = $1, short = $2 WHERE id = $3 RETURNING *',
      [name, short, parsedId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error updating state:", error);
    return NextResponse.json({ error: "Failed to update state" }, { status: 500 });
  }
}

// DELETE: Delete a state
export async function DELETE(_, context) {
  try {
    const { id } = await context.params;
    const parsedId = parseInt(id);

    await query('DELETE FROM "State" WHERE id = $1', [parsedId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting state:", error);
    return NextResponse.json({ error: "Failed to delete state" }, { status: 500 });
  }
}
