import { prisma } from "../../lib/prisma";

export default async function createReceipt(document_id: string, user_id: string) {
    const receipt = await prisma.receipt.create({ 
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
};