import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Companies
  const [lifeGuard, goldenShield, secureHealth] = await Promise.all([
    prisma.company.create({ data: { name: 'LifeGuard Insurance' } }),
    prisma.company.create({ data: { name: 'Golden Shield' } }),
    prisma.company.create({ data: { name: 'Secure Health' } }),
  ]);

  // Health Conditions
  const conditions = await Promise.all([
    prisma.healthCondition.create({
      data: {
        name: 'Diabetes Type 2',
        active: true,
        tags: ['chronic', 'manageable'],
        alternatives: ['Diet and exercise', 'Weight management'],
      },
    }),
    prisma.healthCondition.create({
      data: {
        name: 'Hypertension',
        active: true,
        tags: ['chronic', 'manageable'],
        alternatives: ['Diet and exercise', 'Stress management'],
      },
    }),
    prisma.healthCondition.create({
      data: {
        name: 'Stroke',
        active: true,
        tags: ['acute', 'serious'],
        alternatives: [],
      },
    }),
    prisma.healthCondition.create({
      data: {
        name: 'Heart Attack',
        active: true,
        tags: ['acute', 'serious'],
        alternatives: [],
      },
    }),
    prisma.healthCondition.create({
      data: {
        name: 'Asthma',
        active: true,
        tags: ['chronic', 'manageable'],
        alternatives: ['Avoid triggers', 'Regular medication'],
      },
    }),
  ]);

  // Medications
  const medications = await Promise.all([
    prisma.medication.create({
      data: {
        name: 'Metformin',
        active: true,
        tags: ['diabetes', 'oral'],
        alternatives: ['Lifestyle changes', 'Other oral antidiabetics'],
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Lisinopril',
        active: true,
        tags: ['hypertension', 'heart'],
        alternatives: ['Other ACE inhibitors', 'ARBs'],
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Atorvastatin',
        active: true,
        tags: ['cholesterol', 'heart'],
        alternatives: ['Other statins', 'Diet and exercise'],
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Albuterol',
        active: true,
        tags: ['asthma', 'respiratory'],
        alternatives: ['Other bronchodilators', 'Inhaled corticosteroids'],
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Warfarin',
        active: true,
        tags: ['blood thinner', 'heart'],
        alternatives: ['Newer anticoagulants', 'Aspirin in some cases'],
      },
    }),
  ]);

  // Plans
  const plans = await Promise.all([
    prisma.plan.create({
      data: {
        name: 'LifeGuard GI',
        planType: 'Guaranteed Issue',
        active: true,
        companyId: lifeGuard.id,
      },
    }),
    prisma.plan.create({
      data: {
        name: 'LifeGuard Immediate',
        planType: 'Immediate',
        active: true,
        companyId: lifeGuard.id,
      },
    }),
    prisma.plan.create({
      data: {
        name: 'Golden Shield Immediate',
        planType: 'Immediate',
        active: true,
        companyId: goldenShield.id,
      },
    }),
    prisma.plan.create({
      data: {
        name: 'Golden Shield Graded',
        planType: 'Graded',
        active: true,
        companyId: goldenShield.id,
      },
    }),
    prisma.plan.create({
      data: {
        name: 'Secure Health Basic',
        planType: 'Guaranteed Issue',
        active: true,
        companyId: secureHealth.id,
      },
    }),
  ]);

  // Questions
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        text: 'Have you had a stroke in the past 2 years?',
        active: true,
        companyId: lifeGuard.id,
      },
    }),
    prisma.question.create({
      data: {
        text: 'Have you had a heart attack in the past 3 years?',
        active: true,
        companyId: lifeGuard.id,
      },
    }),
    prisma.question.create({
      data: {
        text: 'Do you currently take more than 3 prescription medications?',
        active: true,
        companyId: goldenShield.id,
      },
    }),
    prisma.question.create({
      data: {
        text: 'Have you been hospitalized in the past 12 months?',
        active: true,
        companyId: goldenShield.id,
      },
    }),
    prisma.question.create({
      data: {
        text: 'Have you been diagnosed with any form of cancer in the past 5 years?',
        active: true,
        companyId: secureHealth.id,
      },
    }),
  ]);

  // Eligibility Rules
  await prisma.eligibilityRule.createMany({
    data: [
      {
        planId: plans[0].id,
        ruleType: 'condition',
        entityId: conditions[2].id, // Stroke
        ruleAction: 'block_if_yes',
        description: 'Block if stroke in past 2 years',
        active: true,
      },
      {
        planId: plans[1].id,
        ruleType: 'condition',
        entityId: conditions[2].id, // Stroke
        ruleAction: 'block_if_yes',
        description: 'Block if stroke in past 2 years',
        active: true,
      },
      {
        planId: plans[1].id,
        ruleType: 'condition',
        entityId: conditions[3].id, // Heart Attack
        ruleAction: 'block_if_yes',
        description: 'Block if heart attack in past 3 years',
        active: true,
      },
      {
        planId: plans[2].id,
        ruleType: 'medication',
        entityId: medications[4].id, // Warfarin
        ruleAction: 'block_if_yes',
        description: 'Block if taking Warfarin',
        active: true,
      },
      {
        planId: plans[3].id,
        ruleType: 'question',
        entityId: questions[2].id,
        ruleAction: 'block_if_yes',
        description: 'Block if taking more than 3 medications',
        active: true,
      },
    ],
  });

  console.log('✅ Seed completed!');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

  