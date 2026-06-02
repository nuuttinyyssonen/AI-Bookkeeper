-- CreateTable
CREATE TABLE "ReceiptVat" (
    "id" SERIAL NOT NULL,
    "receipt_id" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "net_amount" DOUBLE PRECISION NOT NULL,
    "vat_amount" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ReceiptVat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReceiptVat" ADD CONSTRAINT "ReceiptVat_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
