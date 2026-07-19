-- CreateIndex
CREATE INDEX "ChatMessage_chatroom_id_idx" ON "ChatMessage"("chatroom_id");

-- CreateIndex
CREATE INDEX "ChatRoom_user_id_idx" ON "ChatRoom"("user_id");

-- CreateIndex
CREATE INDEX "Document_user_id_idx" ON "Document"("user_id");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE INDEX "PasswordResetToken_user_id_idx" ON "PasswordResetToken"("user_id");

-- CreateIndex
CREATE INDEX "Receipt_user_id_idx" ON "Receipt"("user_id");

-- CreateIndex
CREATE INDEX "Receipt_document_id_idx" ON "Receipt"("document_id");

-- CreateIndex
CREATE INDEX "Receipt_receipt_date_idx" ON "Receipt"("receipt_date");

-- CreateIndex
CREATE INDEX "Receipt_receipt_type_idx" ON "Receipt"("receipt_type");

-- CreateIndex
CREATE INDEX "Receipt_category_id_idx" ON "Receipt"("category_id");

-- CreateIndex
CREATE INDEX "ReceiptVat_receipt_id_idx" ON "ReceiptVat"("receipt_id");

-- CreateIndex
CREATE INDEX "VatReport_user_id_idx" ON "VatReport"("user_id");
