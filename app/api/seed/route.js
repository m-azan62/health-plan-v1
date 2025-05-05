import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function POST() {
  try {
    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Insert companies
      const { rows: companies } = await client.query(`
        INSERT INTO companies (name, active) VALUES
        ('LifeGuard Insurance', true),
        ('Golden Shield', true),
        ('Secure Health', true)
        RETURNING id, name
      `)

      // Insert health conditions
      const { rows: conditions } = await client.query(`
        INSERT INTO health_conditions (name, description, active) VALUES
        ('Diabetes Type 2', 'Type 2 diabetes', true),
        ('Hypertension', 'High blood pressure', true),
        ('Stroke', 'Cerebrovascular accident', true),
        ('Heart Attack', 'Myocardial infarction', true),
        ('Asthma', 'Chronic respiratory condition', true)
        RETURNING id, name
      `)

      // Add tags to conditions
      for (const condition of conditions) {
        if (condition.name === "Diabetes Type 2" || condition.name === "Hypertension" || condition.name === "Asthma") {
          await client.query(
            `
            INSERT INTO condition_tags (condition_id, tag) VALUES
            ($1, 'chronic'),
            ($1, 'manageable')
          `,
            [condition.id],
          )
        } else {
          await client.query(
            `
            INSERT INTO condition_tags (condition_id, tag) VALUES
            ($1, 'acute'),
            ($1, 'serious')
          `,
            [condition.id],
          )
        }
      }

      // Add alternatives to conditions
      await client.query(
        `
        INSERT INTO condition_alternatives (condition_id, alternative) VALUES
        ($1, 'Diet and exercise'),
        ($1, 'Weight management'),
        ($2, 'Diet and exercise'),
        ($2, 'Stress management'),
        ($5, 'Avoid triggers'),
        ($5, 'Regular medication')
      `,
        [conditions[0].id, conditions[1].id, conditions[4].id],
      )

      // Insert medications
      const { rows: medications } = await client.query(`
        INSERT INTO medications (name, description, active) VALUES
        ('Metformin', 'For diabetes management', true),
        ('Lisinopril', 'ACE inhibitor for hypertension', true),
        ('Atorvastatin', 'Statin for cholesterol management', true),
        ('Albuterol', 'Bronchodilator for asthma', true),
        ('Warfarin', 'Anticoagulant', true)
        RETURNING id, name
      `)

      // Add tags to medications
      await client.query(
        `
        INSERT INTO medication_tags (medication_id, tag) VALUES
        ($1, 'diabetes'),
        ($1, 'oral'),
        ($2, 'hypertension'),
        ($2, 'heart'),
        ($3, 'cholesterol'),
        ($3, 'heart'),
        ($4, 'asthma'),
        ($4, 'respiratory'),
        ($5, 'blood thinner'),
        ($5, 'heart')
      `,
        [medications[0].id, medications[1].id, medications[2].id, medications[3].id, medications[4].id],
      )

      // Add alternatives to medications
      await client.query(
        `
        INSERT INTO medication_alternatives (medication_id, alternative) VALUES
        ($1, 'Lifestyle changes'),
        ($1, 'Other oral antidiabetics'),
        ($2, 'Other ACE inhibitors'),
        ($2, 'ARBs'),
        ($3, 'Other statins'),
        ($3, 'Diet and exercise'),
        ($4, 'Other bronchodilators'),
        ($4, 'Inhaled corticosteroids'),
        ($5, 'Newer anticoagulants'),
        ($5, 'Aspirin in some cases')
      `,
        [medications[0].id, medications[1].id, medications[2].id, medications[3].id, medications[4].id],
      )

      // Insert plans
      const { rows: plans } = await client.query(
        `
        INSERT INTO plans (name, company_id, plan_type, active) VALUES
        ('LifeGuard GI', $1, 'Guaranteed Issue', true),
        ('LifeGuard Immediate', $1, 'Immediate', true),
        ('Golden Shield Immediate', $2, 'Immediate', true),
        ('Golden Shield Graded', $2, 'Graded', true),
        ('Secure Health Basic', $3, 'Guaranteed Issue', true)
        RETURNING id, name
      `,
        [companies[0].id, companies[1].id, companies[2].id],
      )

      // Insert plan states
      const stateGroups = [
        ["AL", "AK", "AZ", "AR", "CA"], // For LifeGuard plans
        ["FL", "GA", "CA", "CO", "CT"], // For Golden Shield plans
        ["DE", "FL", "GA", "CA", "CO"], // For Secure Health plans
      ]

      for (let i = 0; i < plans.length; i++) {
        const planId = plans[i].id
        const stateGroup = stateGroups[Math.min(Math.floor(i / 2), 2)]

        for (const stateId of stateGroup) {
          await client.query("INSERT INTO plan_states (plan_id, state_id) VALUES ($1, $2)", [planId, stateId])
        }
      }

      // Insert questions
      const { rows: questions } = await client.query(
        `
        INSERT INTO questions (text, company_id, active) VALUES
        ('Have you had a stroke in the past 2 years?', $1, true),
        ('Have you had a heart attack in the past 3 years?', $1, true),
        ('Do you currently take more than 3 prescription medications?', $2, true),
        ('Have you been hospitalized in the past 12 months?', $2, true),
        ('Have you been diagnosed with any form of cancer in the past 5 years?', $3, true)
        RETURNING id, text
      `,
        [companies[0].id, companies[1].id, companies[2].id],
      )

      // Insert eligibility rules
      await client.query(
        `
        INSERT INTO eligibility_rules (plan_id, rule_type, entity_id, rule_action, description, active) VALUES
        ($1, 'condition', $6, 'block_if_yes', 'Block if stroke in past 2 years', true),
        ($2, 'condition', $6, 'block_if_yes', 'Block if stroke in past 2 years', true),
        ($2, 'condition', $7, 'block_if_yes', 'Block if heart attack in past 3 years', true),
        ($3, 'medication', $10, 'block_if_yes', 'Block if taking Warfarin', true),
        ($4, 'question', $13, 'block_if_yes', 'Block if taking more than 3 medications', true)
      `,
        [
          plans[0].id,
          plans[1].id,
          plans[2].id,
          plans[3].id,
          plans[4].id,
          conditions[2].id,
          conditions[3].id,
          medications[4].id,
          questions[2].id,
        ],
      )

      await client.query("COMMIT")

      return NextResponse.json({
        success: true,
        message: "Database seeded successfully",
        data: {
          companies: companies.length,
          conditions: conditions.length,
          medications: medications.length,
          plans: plans.length,
          questions: questions.length,
          rules: 5,
        },
      })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
