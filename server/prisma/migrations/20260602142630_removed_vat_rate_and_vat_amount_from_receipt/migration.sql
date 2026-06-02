/*
  Warnings:

  - You are about to drop the column `vat_amount` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `vat_rate` on the `Receipt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "vat_amount",
DROP COLUMN "vat_rate";
