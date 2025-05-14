import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET: Fetch all plans
export async function GET() {
  try {
    const result = await query("SELECT * FROM \"Plan\" ORDER BY id DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("❌ Error fetching plans:", error)
    return NextResponse.json({ error: "Failed to load plans" }, { status: 500 })
  }
}

// POST: Create a new plan
export async function POST(request) {
  try {
    const { name, companyId, planTypeId, stateIds, active = true } = await request.json()

    // Validation checks
    if (!name || !companyId || !planTypeId || !stateIds || stateIds.length === 0) {
      return NextResponse.json(
        { error: "Please provide all necessary fields: name, companyId, planTypeId, and stateIds" },
        { status: 400 }
      )
    }

    // Insert the plan into the Plan table
    const result = await query(
      `INSERT INTO "Plan" (name, "companyId", "planTypeId", active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, companyId, planTypeId, active]
    )

    const planId = result.rows[0].id

    // Insert the associated states into the PlanState table
    if (stateIds && stateIds.length > 0) {
      await Promise.all(
        stateIds.map(stateId =>
          query(`INSERT INTO "PlanState" ("planId", "stateId") VALUES ($1, $2)`, [planId, stateId])
        )
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("❌ Error creating plan:", error)
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 })
  }
}
