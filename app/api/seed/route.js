import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function POST(request) {
  let client
  try {
    const data = await request.json()

    client = await pool.connect()
    await client.query("BEGIN")

    // 1. Insert companies
    const companies = []
    for (const company of data.companies || []) {
      const result = await client.query(
        "INSERT INTO companies (name, active) VALUES ($1, $2) RETURNING *",
        [company.name, company.active ?? true]
      )
      companies.push(result.rows[0])
    }

    // 2. Insert conditions
    const conditions = []
    for (const condition of data.conditions || []) {
      const result = await client.query(
        "INSERT INTO health_conditions (name, description, active) VALUES ($1, $2, $3) RETURNING *",
        [condition.name, condition.description, condition.active ?? true]
      )
      const conditionId = result.rows[0].id
      conditions.push(result.rows[0])

      for (const tag of condition.tags || []) {
        await client.query(
          "INSERT INTO condition_tags (condition_id, tag) VALUES ($1, $2)",
          [conditionId, tag]
        )
      }

      for (const alt of condition.alternatives || []) {
        await client.query(
          "INSERT INTO condition_alternatives (condition_id, alternative) VALUES ($1, $2)",
          [conditionId, alt]
        )
      }
    }

    // 3. Insert medications
    const medications = []
    for (const med of data.medications || []) {
      const result = await client.query(
        "INSERT INTO medications (name, description, active) VALUES ($1, $2, $3) RETURNING *",
        [med.name, med.description, med.active ?? true]
      )
      const medId = result.rows[0].id
      medications.push(result.rows[0])

      for (const tag of med.tags || []) {
        await client.query(
          "INSERT INTO medication_tags (medication_id, tag) VALUES ($1, $2)",
          [medId, tag]
        )
      }

      for (const alt of med.alternatives || []) {
        await client.query(
          "INSERT INTO medication_alternatives (medication_id, alternative) VALUES ($1, $2)",
          [medId, alt]
        )
      }
    }

    // 4. Insert plans
    const plans = []
    for (const plan of data.plans || []) {
      const result = await client.query(
        "INSERT INTO plans (name, company_id, plan_type, active) VALUES ($1, $2, $3, $4) RETURNING *",
        [plan.name, plan.company_id, plan.plan_type, plan.active ?? true]
      )
      const planId = result.rows[0].id
      plans.push(result.rows[0])

      for (const state of plan.states || []) {
        await client.query(
          "INSERT INTO plan_states (plan_id, state_id) VALUES ($1, $2)",
          [planId, state]
        )
      }
    }

    // 5. Insert questions
    const questions = []
    for (const q of data.questions || []) {
      const result = await client.query(
        "INSERT INTO questions (text, company_id, active) VALUES ($1, $2, $3) RETURNING *",
        [q.text, q.company_id, q.active ?? true]
      )
      questions.push(result.rows[0])
    }

    // 6. Insert eligibility rules
    for (const rule of data.rules || []) {
      await client.query(
        "INSERT INTO eligibility_rules (plan_id, rule_type, entity_id, rule_action, description, active) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          rule.plan_id,
          rule.rule_type,
          rule.entity_id,
          rule.rule_action,
          rule.description,
          rule.active ?? true,
        ]
      )
    }

    await client.query("COMMIT")

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      stats: {
        companies: companies.length,
        conditions: conditions.length,
        medications: medications.length,
        plans: plans.length,
        questions: questions.length,
        rules: data.rules?.length ?? 0,
      },
    })
  } catch (error) {
    if (client) await client.query("ROLLBACK")
    console.error("❌ Error seeding database:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  } finally {
    if (client) client.release()
  }
}
