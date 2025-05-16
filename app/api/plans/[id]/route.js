import { pool } from "@/lib/db";

// GET: Fetch a single plan by ID with its states
export async function GET(req, context) {
  const { id } = context.params;
  const client = await pool.connect();

  try {
    // Fetch the plan
    const planResult = await client.query(
      'SELECT * FROM "Plan" WHERE id = $1',
      [id]
    );
    if (planResult.rows.length === 0) {
      return new Response("Plan not found", { status: 404 });
    }

    const plan = planResult.rows[0];

    // Fetch related states
    const statesResult = await client.query(
      `
      SELECT s.id, s.name, s.short
      FROM "PlanState" ps
      JOIN "State" s ON ps."stateId" = s.id
      WHERE ps."planId" = $1
    `,
      [id]
    );

    plan.states = statesResult.rows;

    return new Response(JSON.stringify(plan), { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response("Error fetching plan", { status: 500 });
  } finally {
    client.release();
  }
}

// PUT: Update a plan by ID and its associated states
export async function PUT(req, context) {
  const { id } = context.params;
  const body = await req.json();
  const { name, companyId, planTypeId, stateIds } = body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateResult = await client.query(
      'UPDATE "Plan" SET name = $1, "companyId" = $2, "planTypeId" = $3 WHERE id = $4',
      [name, companyId, planTypeId, id]
    );

    if (updateResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return new Response("Plan not found", { status: 404 });
    }

    await client.query('DELETE FROM "PlanState" WHERE "planId" = $1', [id]);

    if (Array.isArray(stateIds) && stateIds.length > 0) {
      for (const stateId of stateIds) {
        await client.query(
          'INSERT INTO "PlanState" ("planId", "stateId") VALUES ($1, $2)',
          [id, stateId]
        );
      }
    }

    await client.query("COMMIT");
    return new Response("Plan updated successfully", { status: 200 });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("PUT error:", error);
    return new Response("Error updating plan", { status: 500 });
  } finally {
    client.release();
  }
}

// DELETE: Remove a plan by ID
export async function DELETE(req, context) {
  const { id } = context.params;
  const client = await pool.connect();

  try {
    const result = await client.query('DELETE FROM "Plan" WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return new Response("Plan not found", { status: 404 });
    }

    return new Response("Plan deleted successfully", { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response("Error deleting plan", { status: 500 });
  } finally {
    client.release();
  }
}
