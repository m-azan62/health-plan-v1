-- DropForeignKey
ALTER TABLE "PlanState" DROP CONSTRAINT "PlanState_planId_fkey";

-- AddForeignKey
ALTER TABLE "PlanState" ADD CONSTRAINT "PlanState_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
