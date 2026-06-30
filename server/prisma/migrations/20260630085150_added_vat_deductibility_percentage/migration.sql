-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "vat_deductibility_percentage" DECIMAL(5,2) NOT NULL DEFAULT 100.0;
