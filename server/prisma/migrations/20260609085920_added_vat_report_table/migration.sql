-- CreateEnum
CREATE TYPE "VatReportPeriod" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM');

-- CreateTable
CREATE TABLE "VatReport" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "period_type" "VatReportPeriod" NOT NULL,
    "sales_net" DECIMAL(65,30) NOT NULL,
    "sales_vat_amount" DECIMAL(65,30) NOT NULL,
    "sales_gross" DECIMAL(65,30) NOT NULL,
    "purchase_net" DECIMAL(65,30) NOT NULL,
    "purchase_vat_amount" DECIMAL(65,30) NOT NULL,
    "purchase_gross" DECIMAL(65,30) NOT NULL,
    "vat_payable" DECIMAL(65,30) NOT NULL,
    "vat_breakdown" JSONB NOT NULL,
    "vat_declaration_sent" BOOLEAN NOT NULL DEFAULT false,
    "pdf_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VatReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VatReport" ADD CONSTRAINT "VatReport_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
