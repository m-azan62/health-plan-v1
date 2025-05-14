// app/api/states/[id]/route.js
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// PUT: Update a state
export async function PUT(request, { params }) {
  try {
    const { id } = await params; // ✅ Await params correctly
    const parsedId = parseInt(id); // Ensure ID is parsed to integer
    const body = await request.json();
    const { name } = body;

    // Validate that name is provided
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Update the state in the database
    const result = await query(
      'UPDATE "State" SET name = $1 WHERE id = $2 RETURNING *',
      [name, parsedId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error updating state:", error);
    return NextResponse.json({ error: "Failed to update state" }, { status: 500 });
  }
}

// DELETE: Delete a state
export async function DELETE(_, { params }) {
  try {
    const { id } = await params; // ✅ Await params correctly
    const parsedId = parseInt(id); // Ensure ID is parsed to integer

    // Delete the state from the database
    await query('DELETE FROM "State" WHERE id = $1', [parsedId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting state:", error);
    return NextResponse.json({ error: "Failed to delete state" }, { status: 500 });
  }
}
