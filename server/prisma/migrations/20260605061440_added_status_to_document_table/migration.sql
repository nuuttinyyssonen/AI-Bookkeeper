-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING';
