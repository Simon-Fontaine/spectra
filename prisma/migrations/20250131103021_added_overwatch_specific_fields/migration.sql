-- CreateEnum
CREATE TYPE "Specialty" AS ENUM ('MAIN_TANK', 'OFF_TANK', 'FLEX_DPS', 'HITSCAN_DPS', 'MAIN_HEAL', 'OFF_HEAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "battletag" TEXT,
ADD COLUMN     "isSubstitute" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specialty" "Specialty" NOT NULL DEFAULT 'MAIN_TANK';
