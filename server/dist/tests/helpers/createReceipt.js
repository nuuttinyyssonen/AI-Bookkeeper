"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createReceipt;
const prisma_1 = require("../../lib/prisma");
async function createReceipt(document_id, user_id) {
    const receipt = await prisma_1.prisma.receipt.create({
        data: {
            document_id: document_id,
            user_id: user_id,
            vendor_name: "test vendor",
            total_amount: 1000,
            receipt_date: new Date(),
            receiptVats: {
                create: {
                    rate: 25.5,
                    net_amount: 19.92,
                    vat_amount: 5.08,
                    total: 25
                }
            }
        }
    });
    return receipt;
}
;
