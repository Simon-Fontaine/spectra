/*
  Warnings:

  - The values [OFF_HEAL] on the enum `Specialty` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Specialty_new" AS ENUM ('MAIN_TANK', 'OFF_TANK', 'FLEX_DPS', 'HITSCAN_DPS', 'MAIN_HEAL', 'FLEX_HEAL');
ALTER TABLE "User" ALTER COLUMN "specialty" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "specialty" TYPE "Specialty_new" USING ("specialty"::text::"Specialty_new");
ALTER TYPE "Specialty" RENAME TO "Specialty_old";
ALTER TYPE "Specialty_new" RENAME TO "Specialty";
DROP TYPE "Specialty_old";
ALTER TABLE "User" ALTER COLUMN "specialty" SET DEFAULT 'MAIN_TANK';
COMMIT;
