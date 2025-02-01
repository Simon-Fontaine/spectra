/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Verification_token_key" ON "Verification"("token");
