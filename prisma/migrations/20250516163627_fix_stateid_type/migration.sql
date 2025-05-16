/*
  Warnings:

  - Changed the type of `stateId` on the `PlanState` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `short` on table `State` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PlanState" DROP COLUMN "stateId",
ADD COLUMN     "stateId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "State" ALTER COLUMN "short" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PlanState" ADD CONSTRAINT "PlanState_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE CASCADE ON UPDATE CASCADE;
