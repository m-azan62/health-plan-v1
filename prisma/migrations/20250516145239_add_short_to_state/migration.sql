/*
  Warnings:

  - A unique constraint covering the columns `[short]` on the table `State` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "State" ADD COLUMN     "short" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "State_short_key" ON "State"("short");
