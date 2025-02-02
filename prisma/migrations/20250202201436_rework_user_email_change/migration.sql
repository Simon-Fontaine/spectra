/*
  Warnings:

  - You are about to drop the column `newEmail` on the `Verification` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Verification_newEmail_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pendingEmail" TEXT;

-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "newEmail";
