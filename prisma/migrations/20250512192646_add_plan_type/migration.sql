/*
  Warnings:

  - You are about to drop the column `planType` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `planTypeId` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "planType",
ADD COLUMN     "planTypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PlanType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PlanType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanType_name_key" ON "PlanType"("name");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_planTypeId_fkey" FOREIGN KEY ("planTypeId") REFERENCES "PlanType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
