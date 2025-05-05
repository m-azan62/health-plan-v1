-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "states" TEXT NOT NULL,
    "payment" TEXT NOT NULL,
    "logicNote" TEXT,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);
