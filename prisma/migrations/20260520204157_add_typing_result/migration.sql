-- CreateTable
CREATE TABLE "TypingResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wpm" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "mode" TEXT NOT NULL DEFAULT '60',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TypingResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TypingResult_userId_idx" ON "TypingResult"("userId");

-- CreateIndex
CREATE INDEX "TypingResult_wpm_idx" ON "TypingResult"("wpm" DESC);

-- AddForeignKey
ALTER TABLE "TypingResult" ADD CONSTRAINT "TypingResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
