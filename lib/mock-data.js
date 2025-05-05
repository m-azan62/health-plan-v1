// This file contains mock data for the application
// Used for client components that need to display data without server fetching

// Companies
export const companies = [
  {
    id: 1,
    name: "Blue Cross Blue Shield",
    active: true,
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Aetna",
    active: true,
    created_at: "2023-01-02T00:00:00.000Z",
    updated_at: "2023-01-02T00:00:00.000Z",
  },
  {
    id: 3,
    name: "UnitedHealthcare",
    active: true,
    created_at: "2023-01-03T00:00:00.000Z",
    updated_at: "2023-01-03T00:00:00.000Z",
  },
  {
    id: 4,
    name: "Cigna",
    active: false,
    created_at: "2023-01-04T00:00:00.000Z",
    updated_at: "2023-01-04T00:00:00.000Z",
  },
  {
    id: 5,
    name: "Humana",
    active: true,
    created_at: "2023-01-05T00:00:00.000Z",
    updated_at: "2023-01-05T00:00:00.000Z",
  },
]

// Plan Types
export const planTypes = [
  { id: "1", name: "Immediate" },
  { id: "2", name: "Graded" },
  { id: "3", name: "Guaranteed Issue" },
]

// States
export const states = [
  { id: "AL", name: "Alabama" },
  { id: "AK", name: "Alaska" },
  { id: "AZ", name: "Arizona" },
  { id: "AR", name: "Arkansas" },
  { id: "CA", name: "California" },
  { id: "CO", name: "Colorado" },
  { id: "CT", name: "Connecticut" },
  { id: "DE", name: "Delaware" },
  { id: "FL", name: "Florida" },
  { id: "GA", name: "Georgia" },
  // Add more states as needed
]

// Plans
export const plans = [
  {
    id: "1",
    name: "LifeGuard GI",
    companyId: 1,
    planTypeId: "3",
    stateIds: ["AL", "AK", "AZ", "AR", "CA"],
    active: true,
  },
  {
    id: "2",
    name: "LifeGuard Immediate",
    companyId: 1,
    planTypeId: "1",
    stateIds: ["AL", "AK", "AZ", "AR", "CA"],
    active: true,
  },
  {
    id: "3",
    name: "Golden Shield Immediate",
    companyId: 2,
    planTypeId: "1",
    stateIds: ["FL", "GA", "CA", "CO", "CT"],
    active: true,
  },
  {
    id: "4",
    name: "Golden Shield Graded",
    companyId: 2,
    planTypeId: "2",
    stateIds: ["FL", "GA", "CA", "CO", "CT"],
    active: true,
  },
  {
    id: "5",
    name: "Secure Health Basic",
    companyId: 3,
    planTypeId: "3",
    stateIds: ["DE", "FL", "GA", "CA", "CO"],
    active: true,
  },
]

// Health Conditions
export const healthConditions = [
  {
    id: "1",
    name: "Diabetes Type 2",
    description: "Type 2 diabetes",
    active: true,
    tags: ["chronic", "manageable"],
    alternatives: ["Diet and exercise", "Weight management"],
  },
  {
    id: "2",
    name: "Hypertension",
    description: "High blood pressure",
    active: true,
    tags: ["chronic", "manageable"],
    alternatives: ["Diet and exercise", "Stress management"],
  },
  {
    id: "3",
    name: "Stroke",
    description: "Cerebrovascular accident",
    active: true,
    tags: ["acute", "serious"],
    alternatives: [],
  },
  {
    id: "4",
    name: "Heart Attack",
    description: "Myocardial infarction",
    active: true,
    tags: ["acute", "serious"],
    alternatives: [],
  },
  {
    id: "5",
    name: "Asthma",
    description: "Chronic respiratory condition",
    active: true,
    tags: ["chronic", "manageable"],
    alternatives: ["Avoid triggers", "Regular medication"],
  },
]

// Medications
export const medications = [
  {
    id: "1",
    name: "Metformin",
    description: "For diabetes management",
    active: true,
    tags: ["diabetes", "oral"],
    alternatives: ["Lifestyle changes", "Other oral antidiabetics"],
  },
  {
    id: "2",
    name: "Lisinopril",
    description: "ACE inhibitor for hypertension",
    active: true,
    tags: ["hypertension", "heart"],
    alternatives: ["Other ACE inhibitors", "ARBs"],
  },
  {
    id: "3",
    name: "Atorvastatin",
    description: "Statin for cholesterol management",
    active: true,
    tags: ["cholesterol", "heart"],
    alternatives: ["Other statins", "Diet and exercise"],
  },
  {
    id: "4",
    name: "Albuterol",
    description: "Bronchodilator for asthma",
    active: true,
    tags: ["asthma", "respiratory"],
    alternatives: ["Other bronchodilators", "Inhaled corticosteroids"],
  },
  {
    id: "5",
    name: "Warfarin",
    description: "Anticoagulant",
    active: true,
    tags: ["blood thinner", "heart"],
    alternatives: ["Newer anticoagulants", "Aspirin in some cases"],
  },
]

// Questions
export const questions = [
  {
    id: "1",
    text: "Have you had a stroke in the past 2 years?",
    companyId: 1,
    active: true,
  },
  {
    id: "2",
    text: "Have you had a heart attack in the past 3 years?",
    companyId: 1,
    active: true,
  },
  {
    id: "3",
    text: "Do you currently take more than 3 prescription medications?",
    companyId: 2,
    active: true,
  },
  {
    id: "4",
    text: "Have you been hospitalized in the past 12 months?",
    companyId: 2,
    active: true,
  },
  {
    id: "5",
    text: "Have you been diagnosed with any form of cancer in the past 5 years?",
    companyId: 3,
    active: true,
  },
]

// Eligibility Rules
export const eligibilityRules = [
  {
    id: "1",
    planId: "1", // LifeGuard GI
    type: "condition",
    entityId: "3", // Stroke
    rule: "block_if_yes",
    description: "Block if stroke in past 2 years",
    active: true,
  },
  {
    id: "2",
    planId: "2", // LifeGuard Immediate
    type: "condition",
    entityId: "3", // Stroke
    rule: "block_if_yes",
    description: "Block if stroke in past 2 years",
    active: true,
  },
  {
    id: "3",
    planId: "2", // LifeGuard Immediate
    type: "condition",
    entityId: "4", // Heart Attack
    rule: "block_if_yes",
    description: "Block if heart attack in past 3 years",
    active: true,
  },
  {
    id: "4",
    planId: "3", // Golden Shield Immediate
    type: "medication",
    entityId: "5", // Warfarin
    rule: "block_if_yes",
    description: "Block if taking Warfarin",
    active: true,
  },
  {
    id: "5",
    planId: "4", // Golden Shield Graded
    type: "question",
    entityId: "3", // More than 3 medications
    rule: "block_if_yes",
    description: "Block if taking more than 3 medications",
    active: true,
  },
]

// Helper function to get company by ID
export function getCompanyById(id) {
  const parsedId = Number.parseInt(id, 10)
  return companies.find((company) => company.id === parsedId)
}

// Helper function to get plan by ID
export function getPlanById(id) {
  return plans.find((plan) => plan.id === id)
}

// Helper function to get plan type by ID
export function getPlanTypeById(id) {
  return planTypes.find((type) => type.id === id)
}

// Helper function to get state by ID
export function getStateById(id) {
  return states.find((state) => state.id === id)
}

// Helper function to get health condition by ID
export function getHealthConditionById(id) {
  return healthConditions.find((condition) => condition.id === id)
}

// Helper function to get medication by ID
export function getMedicationById(id) {
  return medications.find((medication) => medication.id === id)
}

// Helper function to get question by ID
export function getQuestionById(id) {
  return questions.find((question) => question.id === id)
}

// Helper function to get plans by company ID
export function getPlansByCompanyId(companyId) {
  return plans.filter((plan) => plan.companyId === companyId)
}

// Helper function to get questions by company ID
export function getQuestionsByCompanyId(companyId) {
  const parsedCompanyId = Number.parseInt(companyId, 10)
  return questions.filter((question) => question.companyId === parsedCompanyId)
}

// Helper function to get eligibility rules by plan ID
export function getRulesByPlanId(planId) {
  return eligibilityRules.filter((rule) => rule.planId === planId)
}

// Helper function to evaluate eligibility
export function evaluateEligibility(planId, clientData) {
  const plan = getPlanById(planId)
  if (!plan) return { eligible: false, reason: "Plan not found" }

  // Check if plan is available in client's state
  if (!plan.stateIds.includes(clientData.state)) {
    return { eligible: false, reason: "Plan not available in client's state" }
  }

  // Get rules for this plan
  const rules = getRulesByPlanId(planId)

  // Evaluate each rule
  for (const rule of rules) {
    if (!rule.active) continue

    if (rule.type === "condition") {
      const condition = getHealthConditionById(rule.entityId)
      if (!condition) continue

      const hasCondition = clientData.conditions.includes(rule.entityId)
      if (rule.rule === "block_if_yes" && hasCondition) {
        return {
          eligible: false,
          reason: `Ineligible due to health condition: ${condition.name}`,
        }
      }
    } else if (rule.type === "medication") {
      const medication = getMedicationById(rule.entityId)
      if (!medication) continue

      const takesMedication = clientData.medications.includes(rule.entityId)
      if (rule.rule === "block_if_yes" && takesMedication) {
        return {
          eligible: false,
          reason: `Ineligible due to medication: ${medication.name}`,
        }
      }
    } else if (rule.type === "question") {
      const question = getQuestionById(rule.entityId)
      if (!question) continue

      const answer = clientData.questionAnswers[rule.entityId]
      if (rule.rule === "block_if_yes" && answer === true) {
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
export function getEligiblePlans(clientData) {
  const eligiblePlans = []
  const ineligiblePlans = []

  for (const plan of plans) {
    if (!plan.active) continue

    const result = evaluateEligibility(plan.id, clientData)
    const company = getCompanyById(plan.companyId)
    const planType = getPlanTypeById(plan.planTypeId)

    const planInfo = {
      id: plan.id,
      name: plan.name,
      company: company ? company.name : "Unknown Company",
      planType: planType ? planType.name : "Unknown Type",
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
