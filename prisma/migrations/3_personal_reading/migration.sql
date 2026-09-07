-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "readingPlanId" TEXT,
ADD COLUMN     "readingProgress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "readingUpdatedAt" TIMESTAMP(3);

