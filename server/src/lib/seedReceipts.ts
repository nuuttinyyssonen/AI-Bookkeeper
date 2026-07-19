// This file is meant for seeding 1000 receipts to test performance (indexing vs. without indexing)

import { prisma } from "./prisma";

async function seed() {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");

    const document = await prisma.document.findFirst();
    if(!document) throw new Error("No document found");

    const receipts = Array.from({ length: 5000 }, (_, i) => ({
        user_id: user.id,
        document_id: document.id,
        vendor_name: `Vendor ${i}`,
        total_amount: Math.random() * 1000,
        receipt_date: new Date(2022 + Math.floor(i / 500), i % 12, 1),
        receipt_type: i % 2 === 0 ? "INCOME" as const : "EXPENSE" as const,
    }));

    await prisma.receipt.createMany({ data: receipts });
    console.log("Seeded 1000 receipts");
}

seed().catch(console.error).finally(() => prisma.$disconnect());

// bdbb0e32-c5dc-472f-bf2d-7f431df50f02