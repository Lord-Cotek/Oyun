-- Scripture Journey: reading-plan tracking on Journey
ALTER TABLE "Journey" ADD COLUMN     "readingPlanId" TEXT,
ADD COLUMN     "readingProgress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "readingUpdatedAt" TIMESTAMP(3);
