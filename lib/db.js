import { createClient } from "@supabase/supabase-js"
import { Pool } from "pg"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// This code will only run on the server
let pool
if (typeof window === "undefined") {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  })
}

// Helper function to execute queries (server-side only)
async function query(text, params = []) {
  if (typeof window !== "undefined") {
    throw new Error("Database queries can only be executed on the server")
  }

  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

// Companies
export async function getCompanies() {
  const result = await query("SELECT * FROM companies WHERE active = true ORDER BY name")
  return result.rows
}

export async function getAllCompanies() {
  const result = await query("SELECT * FROM companies ORDER BY name")
  return result.rows
}

export async function getCompanyById(id) {
  const result = await query("SELECT * FROM companies WHERE id = $1", [id])
  return result.rows[0] || null
}

export async function createCompany(company) {
  const result = await query("INSERT INTO companies (name, active) VALUES ($1, $2) RETURNING *", [
    company.name,
    company.active,
  ])
  return result.rows[0]
}

export async function updateCompany(id, updates) {
  const result = await query(
    "UPDATE companies SET name = $1, active = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
    [updates.name, updates.active, id],
  )
  return result.rows[0]
}

export async function deleteCompany(id) {
  await query("DELETE FROM companies WHERE id = $1", [id])
  return true
}

// States
export async function getStates() {
  const result = await query("SELECT * FROM states ORDER BY name")
  return result.rows
}

export async function getStateById(id) {
  const result = await query("SELECT * FROM states WHERE id = $1", [id])
  return result.rows[0] || null
}

// Plans
export async function getPlans() {
  const result = await query(`
    SELECT p.*, c.name as company_name 
    FROM plans p
    JOIN companies c ON p.company_id = c.id
    ORDER BY p.name
  `)

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    company_id: row.company_id,
    plan_type: row.plan_type,
    active: row.active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    companies: {
      id: row.company_id,
      name: row.company_name,
    },
  }))
}

export async function getPlanById(id) {
  const result = await query(
    `
    SELECT p.*, c.name as company_name 
    FROM plans p
    JOIN companies c ON p.company_id = c.id
    WHERE p.id = $1
  `,
    [id],
  )

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    id: row.id,
    name: row.name,
    company_id: row.company_id,
    plan_type: row.plan_type,
    active: row.active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    companies: {
      id: row.company_id,
      name: row.company_name,
    },
  }
}

export async function getPlanStates(planId) {
  const result = await query(
    `
    SELECT s.* 
    FROM plan_states ps
    JOIN states s ON ps.state_id = s.id
    WHERE ps.plan_id = $1
  `,
    [planId],
  )

  return result.rows
}

export async function createPlan(plan, stateIds) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Insert plan
    const planResult = await client.query(
      "INSERT INTO plans (name, company_id, plan_type, active) VALUES ($1, $2, $3, $4) RETURNING *",
      [plan.name, plan.companyId, plan.planType, plan.active],
    )

    const newPlanId = planResult.rows[0].id

    // Insert plan states
    if (stateIds && stateIds.length > 0) {
      const stateValues = stateIds.map((stateId, index) => `($1, $${index + 2})`).join(", ")

      const stateParams = [newPlanId, ...stateIds]

      await client.query(`INSERT INTO plan_states (plan_id, state_id) VALUES ${stateValues}`, stateParams)
    }

    await client.query("COMMIT")
    return planResult.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export async function updatePlan(id, updates, stateIds) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Update plan
    const planResult = await client.query(
      "UPDATE plans SET name = $1, company_id = $2, plan_type = $3, active = $4, updated_at = NOW() WHERE id = $5 RETURNING *",
      [updates.name, updates.companyId, updates.planType, updates.active, id],
    )

    // Delete existing plan states
    await client.query("DELETE FROM plan_states WHERE plan_id = $1", [id])

    // Insert new plan states
    if (stateIds && stateIds.length > 0) {
      const stateValues = stateIds.map((stateId, index) => `($1, $${index + 2})`).join(", ")

      const stateParams = [id, ...stateIds]

      await client.query(`INSERT INTO plan_states (plan_id, state_id) VALUES ${stateValues}`, stateParams)
    }

    await client.query("COMMIT")
    return planResult.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export async function deletePlan(id) {
  await query("DELETE FROM plans WHERE id = $1", [id])
  return true
}

// Health Conditions
export async function getHealthConditions() {
  const conditions = await query("SELECT * FROM health_conditions ORDER BY name")

  // Get tags and alternatives for each condition
  const conditionsWithDetails = await Promise.all(
    conditions.rows.map(async (condition) => {
      const tags = await getConditionTags(condition.id)
      const alternatives = await getConditionAlternatives(condition.id)

      return {
        ...condition,
        tags,
        alternatives,
      }
    }),
  )

  return conditionsWithDetails
}

export async function getConditionTags(conditionId) {
  const result = await query("SELECT tag FROM condition_tags WHERE condition_id = $1", [conditionId])

  return result.rows.map((row) => row.tag)
}

export async function getConditionAlternatives(conditionId) {
  const result = await query("SELECT alternative FROM condition_alternatives WHERE condition_id = $1", [conditionId])

  return result.rows.map((row) => row.alternative)
}

export async function getHealthConditionById(id) {
  const result = await query("SELECT * FROM health_conditions WHERE id = $1", [id])

  if (result.rows.length === 0) return null

  const condition = result.rows[0]
  const tags = await getConditionTags(id)
  const alternatives = await getConditionAlternatives(id)

  return {
    ...condition,
    tags,
    alternatives,
  }
}

export async function createHealthCondition(condition) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Insert condition
    const conditionResult = await client.query(
      "INSERT INTO health_conditions (name, description, active) VALUES ($1, $2, $3) RETURNING *",
      [condition.name, condition.description, condition.active],
    )

    const newConditionId = conditionResult.rows[0].id

    // Insert tags
    if (condition.tags && condition.tags.length > 0) {
      const tagValues = condition.tags.map((tag, index) => `($1, $${index + 2})`).join(", ")

      const tagParams = [newConditionId, ...condition.tags]

      await client.query(`INSERT INTO condition_tags (condition_id, tag) VALUES ${tagValues}`, tagParams)
    }

    // Insert alternatives
    if (condition.alternatives && condition.alternatives.length > 0) {
      const altValues = condition.alternatives.map((alt, index) => `($1, $${index + 2})`).join(", ")

      const altParams = [newConditionId, ...condition.alternatives]

      await client.query(
        `INSERT INTO condition_alternatives (condition_id, alternative) VALUES ${altValues}`,
        altParams,
      )
    }

    await client.query("COMMIT")

    return {
      ...conditionResult.rows[0],
      tags: condition.tags || [],
      alternatives: condition.alternatives || [],
    }
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export async function updateHealthCondition(id, updates) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Update condition
    const conditionResult = await client.query(
      "UPDATE health_conditions SET name = $1, description = $2, active = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
      [updates.name, updates.description, updates.active, id],
    )

    // Delete existing tags and alternatives
    await client.query("DELETE FROM condition_tags WHERE condition_id = $1", [id])
    await client.query("DELETE FROM condition_alternatives WHERE condition_id = $1", [id])

    // Insert new tags
    if (updates.tags && updates.tags.length > 0) {
      const tagValues = updates.tags.map((tag, index) => `($1, $${index + 2})`).join(", ")

      const tagParams = [id, ...updates.tags]

      await client.query(`INSERT INTO condition_tags (condition_id, tag) VALUES ${tagValues}`, tagParams)
    }

    // Insert new alternatives
    if (updates.alternatives && updates.alternatives.length > 0) {
      const altValues = updates.alternatives.map((alt, index) => `($1, $${index + 2})`).join(", ")

      const altParams = [id, ...updates.alternatives]

      await client.query(
        `INSERT INTO condition_alternatives (condition_id, alternative) VALUES ${altValues}`,
        altParams,
      )
    }

    await client.query("COMMIT")

    return {
      ...conditionResult.rows[0],
      tags: updates.tags || [],
      alternatives: updates.alternatives || [],
    }
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export async function deleteHealthCondition(id) {
  await query("DELETE FROM health_conditions WHERE id = $1", [id])
  return true
}

// Medications
export async function getMedications() {
  const medications = await query("SELECT * FROM medications ORDER BY name")

  // Get tags and alternatives for each medication
  const medicationsWithDetails = await Promise.all(
    medications.rows.map(async (medication) => {
      const tags = await getMedicationTags(medication.id)
      const alternatives = await getMedicationAlternatives(medication.id)

      return {
        ...medication,
        tags,
        alternatives,
      }
    }),
  )

  return medicationsWithDetails
}

export async function getMedicationTags(medicationId) {
  const result = await query("SELECT tag FROM medication_tags WHERE medication_id = $1", [medicationId])

  return result.rows.map((row) => row.tag)
}

export async function getMedicationAlternatives(medicationId) {
  const result = await query("SELECT alternative FROM medication_alternatives WHERE medication_id = $1", [medicationId])

  return result.rows.map((row) => row.alternative)
}

export async function getMedicationById(id) {
  const result = await query("SELECT * FROM medications WHERE id = $1", [id])

  if (result.rows.length === 0) return null

  const medication = result.rows[0]
  const tags = await getMedicationTags(id)
  const alternatives = await getMedicationAlternatives(id)

  return {
    ...medication,
    tags,
    alternatives,
  }
}

export async function createMedication(medication) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Insert medication
    const medicationResult = await client.query(
      "INSERT INTO medications (name, description, active) VALUES ($1, $2, $3) RETURNING *",
      [medication.name, medication.description, medication.active],
    )

    const newMedicationId = medicationResult.rows[0].id

    // Insert tags
    if (medication.tags && medication.tags.length > 0) {
      const tagValues = medication.tags.map((tag, index) => `($1, $${index + 2})`).join(", ")

      const tagParams = [newMedicationId, ...medication.tags]

      await client.query(`INSERT INTO medication_tags (medication_id, tag) VALUES ${tagValues}`, tagParams)
    }

    // Insert alternatives
    if (medication.alternatives && medication.alternatives.length > 0) {
      const altValues = medication.alternatives.map((alt, index) => `($1, $${index + 2})`).join(", ")

      const altParams = [newMedicationId, ...medication.alternatives]

      await client.query(
        `INSERT INTO medication_alternatives (medication_id, alternative) VALUES ${altValues}`,
        altParams,
      )
    }

    await client.query("COMMIT")

    return {
      ...medicationResult.rows[0],
      tags: medication.tags || [],
      alternatives: medication.alternatives || [],
    }
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export async function updateMedication(id, updates) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Update medication
    const medicationResult = await client.query(
      "UPDATE medications SET name = $1, description = $2, active = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
      [updates.name, updates.description, updates.active, id],
    )

    // Delete existing tags and alternatives
    await client.query("DELETE FROM medication_tags WHERE medication_id = $1", [id])
    await client.query("DELETE FROM medication_alternatives WHERE medication_id = $1", [id])

    // Insert new tags
    if (updates.tags && updates.tags.length > 0) {
      const tagValues = updates.tags.map((tag, index) => `($1, $${index + 2})`).join(", ")

      const tagParams = [id, ...updates.tags]

      await client.query(`INSERT INTO medication_tags (medication_id, tag) VALUES ${tagValues}`, tagParams)
    }

    // Insert new alternatives
    if (updates.alternatives && updates.alternatives.length > 0) {
      const altValues = updates.alternatives.map((alt, index) => `($1, $${index + 2})`).join(", ")

      const altParams = [id, ...updates.alternatives]

      await client.query(
        `INSERT INTO medication_alternatives (medication_id, alternative) VALUES ${altValues}`,
        altParams,
      )
    }

    await client.query("COMMIT")

    return {
      ...medicationResult.rows[0],
      tags: updates.tags || [],
      alternatives: updates.alternatives || [],
    }
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export async function deleteMedication(id) {
  await query("DELETE FROM medications WHERE id = $1", [id])
  return true
}

// Questions
export async function getQuestions() {
  const result = await query(`
    SELECT q.*, c.name as company_name 
    FROM questions q
    JOIN companies c ON q.company_id = c.id
    ORDER BY q.text
  `)

  return result.rows.map((row) => ({
    id: row.id,
    text: row.text,
    company_id: row.company_id,
    active: row.active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    companies: {
      id: row.company_id,
      name: row.company_name,
    },
  }))
}

export async function getQuestionById(id) {
  const result = await query(
    `
    SELECT q.*, c.name as company_name 
    FROM questions q
    JOIN companies c ON q.company_id = c.id
    WHERE q.id = $1
  `,
    [id],
  )

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    id: row.id,
    text: row.text,
    company_id: row.company_id,
    active: row.active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    companies: {
      id: row.company_id,
      name: row.company_name,
    },
  }
}

export async function getQuestionsByCompanyId(companyId) {
  const result = await query("SELECT * FROM questions WHERE company_id = $1 AND active = true ORDER BY text", [
    companyId,
  ])

  return result.rows
}

export async function createQuestion(question) {
  const result = await query("INSERT INTO questions (text, company_id, active) VALUES ($1, $2, $3) RETURNING *", [
    question.text,
    question.companyId,
    question.active,
  ])

  return result.rows[0]
}

export async function updateQuestion(id, updates) {
  const result = await query(
    "UPDATE questions SET text = $1, company_id = $2, active = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
    [updates.text, updates.companyId, updates.active, id],
  )

  return result.rows[0]
}

export async function deleteQuestion(id) {
  await query("DELETE FROM questions WHERE id = $1", [id])
  return true
}

// Eligibility Rules
export async function getEligibilityRules() {
  const result = await query(`
    SELECT r.*, p.name as plan_name 
    FROM eligibility_rules r
    JOIN plans p ON r.plan_id = p.id
    ORDER BY r.created_at
  `)

  return result.rows.map((row) => ({
    id: row.id,
    plan_id: row.plan_id,
    rule_type: row.rule_type,
    entity_id: row.entity_id,
    rule_action: row.rule_action,
    description: row.description,
    active: row.active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    plans: {
      id: row.plan_id,
      name: row.plan_name,
    },
  }))
}

export async function getEligibilityRuleById(id) {
  const result = await query(
    `
    SELECT r.*, p.name as plan_name 
    FROM eligibility_rules r
    JOIN plans p ON r.plan_id = p.id
    WHERE r.id = $1
  `,
    [id],
  )

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    id: row.id,
    plan_id: row.plan_id,
    rule_type: row.rule_type,
    entity_id: row.entity_id,
    rule_action: row.rule_action,
    description: row.description,
    active: row.active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    plans: {
      id: row.plan_id,
      name: row.plan_name,
    },
  }
}

export async function getRulesByPlanId(planId) {
  const result = await query("SELECT * FROM eligibility_rules WHERE plan_id = $1 AND active = true", [planId])

  return result.rows
}

export async function createEligibilityRule(rule) {
  const result = await query(
    "INSERT INTO eligibility_rules (plan_id, rule_type, entity_id, rule_action, description, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [rule.planId, rule.type, rule.entityId, rule.rule, rule.description, rule.active],
  )

  return result.rows[0]
}

export async function updateEligibilityRule(id, updates) {
  const result = await query(
    "UPDATE eligibility_rules SET plan_id = $1, rule_type = $2, entity_id = $3, rule_action = $4, description = $5, active = $6, updated_at = NOW() WHERE id = $7 RETURNING *",
    [updates.planId, updates.type, updates.entityId, updates.rule, updates.description, updates.active, id],
  )

  return result.rows[0]
}

export async function deleteEligibilityRule(id) {
  await query("DELETE FROM eligibility_rules WHERE id = $1", [id])
  return true
}

// Quotes
export async function createQuote(quoteData) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Create or get client
    let clientId

    if (quoteData.clientId) {
      clientId = quoteData.clientId
    } else {
      // Create new client
      const clientResult = await client.query(
        "INSERT INTO clients (first_name, last_name, state_id, agent_id) VALUES ($1, $2, $3, $4) RETURNING id",
        [quoteData.firstName, quoteData.lastName, quoteData.state, quoteData.agentId],
      )

      clientId = clientResult.rows[0].id
    }

    // Create quote
    const quoteResult = await client.query(
      "INSERT INTO quotes (client_id, agent_id, status) VALUES ($1, $2, $3) RETURNING *",
      [clientId, quoteData.agentId, "pending"],
    )

    const quoteId = quoteResult.rows[0].id

    // Add conditions
    if (quoteData.conditions && quoteData.conditions.length > 0) {
      const conditionValues = quoteData.conditions.map((_, index) => `($1, $${index + 2})`).join(", ")

      const conditionParams = [quoteId, ...quoteData.conditions]

      await client.query(
        `INSERT INTO quote_conditions (quote_id, condition_id) VALUES ${conditionValues}`,
        conditionParams,
      )
    }

    // Add medications
    if (quoteData.medications && quoteData.medications.length > 0) {
      const medicationValues = quoteData.medications.map((_, index) => `($1, $${index + 2})`).join(", ")

      const medicationParams = [quoteId, ...quoteData.medications]

      await client.query(
        `INSERT INTO quote_medications (quote_id, medication_id) VALUES ${medicationValues}`,
        medicationParams,
      )
    }

    // Add question answers
    if (quoteData.questionAnswers && Object.keys(quoteData.questionAnswers).length > 0) {
      for (const [questionId, answer] of Object.entries(quoteData.questionAnswers)) {
        await client.query("INSERT INTO quote_answers (quote_id, question_id, answer) VALUES ($1, $2, $3)", [
          quoteId,
          questionId,
          answer,
        ])
      }
    }

    await client.query("COMMIT")
    return quoteResult.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// Evaluate eligibility
export async function evaluateEligibility(planId, clientData) {
  // Get plan
  const plan = await getPlanById(planId)
  if (!plan) return { eligible: false, reason: "Plan not found" }

  // Check if plan is available in client's state
  const planStates = await getPlanStates(planId)
  const stateIds = planStates.map((state) => state.id)

  if (!stateIds.includes(clientData.state)) {
    return { eligible: false, reason: "Plan not available in client's state" }
  }

  // Get rules for this plan
  const rules = await getRulesByPlanId(planId)

  // Evaluate each rule
  for (const rule of rules) {
    if (!rule.active) continue

    if (rule.rule_type === "condition") {
      const condition = await getHealthConditionById(rule.entity_id)
      if (!condition) continue

      const hasCondition = clientData.conditions.includes(rule.entity_id)
      if (rule.rule_action === "block_if_yes" && hasCondition) {
        return {
          eligible: false,
          reason: `Ineligible due to health condition: ${condition.name}`,
        }
      } else if (rule.rule_action === "block_if_no" && !hasCondition) {
        return {
          eligible: false,
          reason: `Ineligible due to absence of health condition: ${condition.name}`,
        }
      }
    } else if (rule.rule_type === "medication") {
      const medication = await getMedicationById(rule.entity_id)
      if (!medication) continue

      const takesMedication = clientData.medications.includes(rule.entity_id)
      if (rule.rule_action === "block_if_yes" && takesMedication) {
        return {
          eligible: false,
          reason: `Ineligible due to medication: ${medication.name}`,
        }
      } else if (rule.rule_action === "block_if_no" && !takesMedication) {
        return {
          eligible: false,
          reason: `Ineligible due to not taking medication: ${medication.name}`,
        }
      }
    } else if (rule.rule_type === "question") {
      const question = await getQuestionById(rule.entity_id)
      if (!question) continue

      const answer = clientData.questionAnswers[rule.entity_id]
      if (rule.rule_action === "block_if_yes" && answer === true) {
        return {
          eligible: false,
          reason: `Ineligible due to answer to: "${question.text}"`,
        }
      } else if (rule.rule_action === "block_if_no" && answer === false) {
        return {
          eligible: false,
          reason: `Ineligible due to answer to: "${question.text}"`,
        }
      }
    }
  }

  // If no rules blocked eligibility, the client is eligible
  return { eligible: true, reason: "Eligible for this plan" }
}

// Function to get eligible plans for a client
export async function getEligiblePlans(clientData) {
  const plans = await getPlans()
  const eligiblePlans = []
  const ineligiblePlans = []

  for (const plan of plans) {
    if (!plan.active) continue

    const result = await evaluateEligibility(plan.id, clientData)

    const planInfo = {
      id: plan.id,
      name: plan.name,
      company: plan.companies ? plan.companies.name : "Unknown Company",
      planType: plan.plan_type,
      reason: result.reason,
    }

    if (result.eligible) {
      eligiblePlans.push(planInfo)
    } else {
      ineligiblePlans.push(planInfo)
    }
  }

  return { eligiblePlans, ineligiblePlans }
}

// Export the pool for direct access if needed
export { pool }
