/*
  Warnings:

  - A unique constraint covering the columns `[business_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `business_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "business_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_business_id_key" ON "User"("business_id");
