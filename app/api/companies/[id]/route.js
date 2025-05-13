import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Update a company
export async function PUT(request, context) {
  const { id } = await context.params;
  const companyId = parseInt(id);

  const body = await request.json();
  const { name, active } = body;

  try {
    const result = await query(
      `UPDATE "Company"
       SET name = $1, active = $2
       WHERE id = $3
       RETURNING id, name, active`,
      [name, active ?? true, companyId]
    );

    // Convert result rows to plain JSON-safe values
    const updatedCompany = result.rows[0];
    return NextResponse.json({
      id: updatedCompany.id,
      name: updatedCompany.name,
      active: updatedCompany.active
    });
  } catch (error) {
    console.error("❌ Error updating company:", error);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}

// Delete a company
export async function DELETE(request, context) {
  const { id } = await context.params;
  const companyId = parseInt(id);

  try {
    await query(`DELETE FROM "Company" WHERE id = $1`, [companyId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting company:", error);
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}
