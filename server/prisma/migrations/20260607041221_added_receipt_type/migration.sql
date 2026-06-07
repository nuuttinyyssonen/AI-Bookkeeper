-- CreateEnum
CREATE TYPE "ReceiptType" AS ENUM ('INCOME', 'EXPENSE');

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "receipt_type" "ReceiptType" NOT NULL DEFAULT 'EXPENSE';
