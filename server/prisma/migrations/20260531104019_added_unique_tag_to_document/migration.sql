/*
  Warnings:

  - A unique constraint covering the columns `[document_name]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Document_document_name_key" ON "Document"("document_name");
