-- CreateTable
CREATE TABLE "ReadingNote" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "bookSlug" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReadingNote_journeyId_bookSlug_chapter_idx" ON "ReadingNote"("journeyId", "bookSlug", "chapter");

-- CreateIndex
CREATE INDEX "ReadingNote_authorId_idx" ON "ReadingNote"("authorId");

-- AddForeignKey
ALTER TABLE "ReadingNote" ADD CONSTRAINT "ReadingNote_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingNote" ADD CONSTRAINT "ReadingNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

