/*
  Warnings:

  - The values [QUARTERLY,CUSTOM] on the enum `VatReportPeriod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VatReportPeriod_new" AS ENUM ('MONTHLY', 'YEARLY', 'Q1', 'Q2', 'Q3', 'Q4');
ALTER TABLE "VatReport" ALTER COLUMN "period_type" TYPE "VatReportPeriod_new" USING ("period_type"::text::"VatReportPeriod_new");
ALTER TYPE "VatReportPeriod" RENAME TO "VatReportPeriod_old";
ALTER TYPE "VatReportPeriod_new" RENAME TO "VatReportPeriod";
DROP TYPE "public"."VatReportPeriod_old";
COMMIT;
