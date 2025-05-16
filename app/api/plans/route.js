import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET: Fetch all plans with their associated states
export async function GET() {
  try {
    // Fetch all plans
    const plansResult = await query('SELECT * FROM "Plan" ORDER BY id DESC')
    const plans = plansResult.rows

    // Fetch all states linked to plans in one go
    const statesResult = await query(`
      SELECT ps."planId", s.id, s.name, s.short
      FROM "PlanState" ps
      JOIN "State" s ON ps."stateId" = s.id
    `)

    // Group states by planId
    const planStatesMap = {}
    statesResult.rows.forEach(state => {
      if (!planStatesMap[state.planId]) {
        planStatesMap[state.planId] = []
      }
      planStatesMap[state.planId].push({
        id: state.id,
        name: state.name,
        short: state.short
      })
    })

    // Attach states to each plan
    const enrichedPlans = plans.map(plan => ({
      ...plan,
      states: planStatesMap[plan.id] || []
    }))

    return NextResponse.json(enrichedPlans)
  } catch (error) {
    console.error("❌ Error fetching plans:", error)
    return NextResponse.json({ error: "Failed to load plans" }, { status: 500 })
  }
}

// POST: Create a new plan
export async function POST(request) {
  try {
    const { name, companyId, planTypeId, stateIds, active = true } = await request.json()

    // Validate required fields
    if (!name || !companyId || !planTypeId || !Array.isArray(stateIds) || stateIds.length === 0) {
      return NextResponse.json(
        { error: "Please provide all required fields: name, companyId, planTypeId, and stateIds[]" },
        { status: 400 }
      )
    }

    // Insert the new plan
    const planResult = await query(
      `INSERT INTO "Plan" (name, "companyId", "planTypeId", active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, companyId, planTypeId, active]
    )

    const plan = planResult.rows[0]

    // Link the states
    await Promise.all(
      stateIds.map(stateId =>
        query(`INSERT INTO "PlanState" ("planId", "stateId") VALUES ($1, $2)`, [plan.id, stateId])
      )
    )

    return NextResponse.json(plan)
  } catch (error) {
    console.error("❌ Error creating plan:", error)
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 })
  }
}
