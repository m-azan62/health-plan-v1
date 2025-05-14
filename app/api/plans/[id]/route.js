import { pool } from "@/lib/db"

// DELETE: Delete plan by ID (remove relationship with states)
export async function DELETE(req, context) {
  const { id } = context.params  // Access params here (awaited)
  const client = await pool.connect()

  try {
    // Step 1: Delete the related PlanState records (remove the relationship between Plan and States)
    const deletePlanStatesQuery = `
      DELETE FROM "PlanState"
      WHERE "planId" = $1
    `
    await client.query(deletePlanStatesQuery, [id])

    // Step 2: Now delete the Plan record itself
    const deletePlanQuery = `
      DELETE FROM "Plan"
      WHERE "id" = $1
    `
    await client.query(deletePlanQuery, [id])

    return new Response(null, { status: 200 })
  } catch (error) {
    console.error("❌ Error deleting plan:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  } finally {
    client.release()
  }
}

// PUT: Edit plan by ID
export async function PUT(req, { params }) {
  const { id } = params  // Access params here (awaited)
  const { name, companyId, planTypeId, stateIds, active } = await req.json()

  if (!name || !companyId || !planTypeId || !stateIds || stateIds.length === 0) {
    return new Response(
      JSON.stringify({ error: "Please provide all necessary fields: name, companyId, planTypeId, and stateIds" }),
      { status: 400 }
    )
  }

  const client = await pool.connect()

  try {
    // Step 1: Update the Plan record
    const updatePlanQuery = `
      UPDATE "Plan"
      SET name = $1, "companyId" = $2, "planTypeId" = $3, active = $4
      WHERE "id" = $5
      RETURNING *
    `
    const result = await client.query(updatePlanQuery, [name, companyId, planTypeId, active, id])

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: "Plan not found" }), { status: 404 })
    }

    // Step 2: Delete the existing PlanState records (remove the old relationships)
    const deletePlanStatesQuery = `
      DELETE FROM "PlanState"
      WHERE "planId" = $1
    `
    await client.query(deletePlanStatesQuery, [id])

    // Step 3: Insert new PlanState records based on the provided stateIds
    if (stateIds && stateIds.length > 0) {
      await Promise.all(
        stateIds.map(stateId =>
          client.query(`INSERT INTO "PlanState" ("planId", "stateId") VALUES ($1, $2)`, [id, stateId])
        )
      )
    }

    // Return the updated plan data
    return new Response(JSON.stringify(result.rows[0]), { status: 200 })
  } catch (error) {
    console.error("❌ Error editing plan:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  } finally {
    client.release()
  }
}
