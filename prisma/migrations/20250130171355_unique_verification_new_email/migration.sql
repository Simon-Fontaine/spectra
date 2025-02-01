/*
  Warnings:

  - A unique constraint covering the columns `[newEmail]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Verification_newEmail_key" ON "Verification"("newEmail");
