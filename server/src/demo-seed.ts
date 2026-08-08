import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma";

const DEMO_USER_ID = "demo-user-fixed-id";

async function main() {
    console.log("Seeding demo data...");

    // Clean existing demo data
    await prisma.chatMessage.deleteMany({ where: { chatroom: { user_id: DEMO_USER_ID } } });
    await prisma.chatRoom.deleteMany({ where: { user_id: DEMO_USER_ID } });
    await prisma.receiptVat.deleteMany({ where: { receipt: { user_id: DEMO_USER_ID } } });
    await prisma.receipt.deleteMany({ where: { user_id: DEMO_USER_ID } });
    await prisma.document.deleteMany({ where: { user_id: DEMO_USER_ID } });
    await prisma.vatReport.deleteMany({ where: { user_id: DEMO_USER_ID } });
    await prisma.subscription.deleteMany({ where: { user_id: DEMO_USER_ID } });
    await prisma.user.deleteMany({ where: { id: DEMO_USER_ID } });

    // Create demo user
    const hashedPassword = await bcrypt.hash("demo123", 10);
    await prisma.user.create({
        data: {
            id: DEMO_USER_ID,
            email: "demo@aibookkeeper.fi",
            password: hashedPassword,
            first_name: "Demo",
            last_name: "Käyttäjä",
            phonenumber: "0401234567",
            business_id: "1234567-8",
        }
    });

    // Ensure categories exist
    const categories = [
        { type: "KALUSTO_JA_LAITTEET", label: "Kalusto ja laitteet" },
        { type: "OHJELMISTOT_JA_LISENSSIT", label: "Ohjelmistot ja lisenssit" },
        { type: "MYYNTI_PALVELUT", label: "Myynti - palvelut" },
    ] as const;

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { type: cat.type },
            update: {},
            create: cat,
        });
    }

    const categoryMap = await prisma.category.findMany({
        where: { type: { in: categories.map(c => c.type) } }
    });
    const cat = (type: string) => categoryMap.find(c => c.type === type)?.id;

    // Receipts
    const receipts = [
        {
            document_name: "demo_1.png",
            vendor_name: "Verkkokauppa.com Oyj",
            total_amount: 119.90,
            receipt_date: new Date("2026-01-07"),
            receipt_type: "EXPENSE" as const,
            category_type: "KALUSTO_JA_LAITTEET",
            is_deductible: true,
            vats: [{ rate: 25.5, net_amount: 95.62, vat_amount: 24.28, total: 119.90 }],
        },
        {
            document_name: "demo_3.png",
            vendor_name: "Fonum Kirjakauppa",
            total_amount: 149.90,
            receipt_date: new Date("2026-01-17"),
            receipt_type: "EXPENSE" as const,
            category_type: "OHJELMISTOT_JA_LISENSSIT",
            is_deductible: true,
            vats: [{ rate: 25.5, net_amount: 119.60, vat_amount: 30.30, total: 149.90 }],
        },
        {
            document_name: "demo_4.png",
            vendor_name: "Koodikulma Software Oy",
            total_amount: 903.60,
            receipt_date: new Date("2026-08-07"),
            receipt_type: "INCOME" as const,
            category_type: "MYYNTI_PALVELUT",
            is_deductible: false,
            vats: [{ rate: 25.5, net_amount: 720.00, vat_amount: 183.60, total: 903.60 }],
        },
        {
            document_name: "demo_5.png",
            vendor_name: "Koodikulma Labs Oy",
            total_amount: 2265.28,
            receipt_date: new Date("2026-08-08"),
            receipt_type: "INCOME" as const,
            category_type: "MYYNTI_PALVELUT",
            is_deductible: false,
            vats: [{ rate: 25.5, net_amount: 1805.00, vat_amount: 460.28, total: 2265.28 }],
        },
        {
            document_name: "demo_6.png",
            vendor_name: "Koodikulma Labs Oy",
            total_amount: 3012.00,
            receipt_date: new Date("2026-05-15"),
            receipt_type: "INCOME" as const,
            category_type: "MYYNTI_PALVELUT",
            is_deductible: false,
            vats: [{ rate: 25.5, net_amount: 2400.00, vat_amount: 612.00, total: 3012.00 }],
        },
        {
            document_name: "demo_7.png",
            vendor_name: "Gigantti Helsinki Forum",
            total_amount: 367.00,
            receipt_date: new Date("2026-05-20"),
            receipt_type: "EXPENSE" as const,
            category_type: "KALUSTO_JA_LAITTEET",
            is_deductible: true,
            vats: [{ rate: 25.5, net_amount: 292.43, vat_amount: 74.57, total: 367.00 }],
        },
        {
            document_name: "demo_8.png",
            vendor_name: "Koodikulma Software Oy",
            total_amount: 3790.10,
            receipt_date: new Date("2026-06-12"),
            receipt_type: "INCOME" as const,
            category_type: "MYYNTI_PALVELUT",
            is_deductible: false,
            vats: [{ rate: 25.5, net_amount: 3020.00, vat_amount: 770.10, total: 3790.10 }],
        },
        {
            document_name: "demo_9.png",
            vendor_name: "Power Lippulaiva",
            total_amount: 349.00,
            receipt_date: new Date("2026-06-18"),
            receipt_type: "EXPENSE" as const,
            category_type: "KALUSTO_JA_LAITTEET",
            is_deductible: true,
            vats: [{ rate: 25.5, net_amount: 278.09, vat_amount: 70.91, total: 349.00 }],
        },
    ];

    for (const r of receipts) {
        const doc = await prisma.document.create({
            data: {
                document_name: r.document_name,
                document_type: "image/jpeg",
                document_size: 1024000,
                file_path: r.document_name,
                status: "COMPLETED",
                user_id: DEMO_USER_ID,
            }
        });

        const receipt = await prisma.receipt.create({
            data: {
                document_id: doc.id,
                user_id: DEMO_USER_ID,
                category_id: cat(r.category_type),
                vendor_name: r.vendor_name,
                total_amount: r.total_amount,
                receipt_date: r.receipt_date,
                receipt_type: r.receipt_type,
                is_deductible: r.is_deductible,
            }
        });

        await prisma.receiptVat.createMany({
            data: r.vats.map(v => ({ ...v, receipt_id: receipt.id }))
        });
    }

    // VAT Report Q1 2026 (expenses)
    await prisma.vatReport.create({
        data: {
            user_id: DEMO_USER_ID,
            period_start: new Date("2026-01-01"),
            period_end: new Date("2026-03-31"),
            period_type: "Q1",
            sales_net: 0,
            sales_vat_amount: 0,
            sales_gross: 0,
            purchase_net: 215.22,
            purchase_vat_amount: 54.58,
            purchase_gross: 269.80,
            vat_payable: -54.58,
            vat_breakdown: {
                sales: [],
                purchases: [
                    { rate: 25.5, net: 215.22, vat_amount: 54.58, gross: 269.80 },
                ]
            },
            vat_declaration_sent: true,
        }
    });

    // VAT Report Q2 2026 (income + expenses)
    await prisma.vatReport.create({
        data: {
            user_id: DEMO_USER_ID,
            period_start: new Date("2026-04-01"),
            period_end: new Date("2026-06-30"),
            period_type: "Q2",
            sales_net: 5420.00,
            sales_vat_amount: 1382.10,
            sales_gross: 6802.10,
            purchase_net: 570.52,
            purchase_vat_amount: 145.48,
            purchase_gross: 716.00,
            vat_payable: 1236.62,
            vat_breakdown: {
                sales: [
                    { rate: 25.5, net: 5420.00, vat_amount: 1382.10, gross: 6802.10 },
                ],
                purchases: [
                    { rate: 25.5, net: 570.52, vat_amount: 145.48, gross: 716.00 },
                ]
            },
            vat_declaration_sent: true,
        }
    });

    // VAT Report Q3 2026 (income)
    await prisma.vatReport.create({
        data: {
            user_id: DEMO_USER_ID,
            period_start: new Date("2026-07-01"),
            period_end: new Date("2026-09-30"),
            period_type: "Q3",
            sales_net: 2525.00,
            sales_vat_amount: 643.88,
            sales_gross: 3168.88,
            purchase_net: 0,
            purchase_vat_amount: 0,
            purchase_gross: 0,
            vat_payable: 643.88,
            vat_breakdown: {
                sales: [
                    { rate: 25.5, net: 2525.00, vat_amount: 643.88, gross: 3168.88 },
                ],
                purchases: []
            },
            vat_declaration_sent: false,
        }
    });

    // Subscription
    await prisma.subscription.create({
        data: {
            user_id: DEMO_USER_ID,
            subscription_type: "PREMIUM",
            subscription_status: "ACTIVE",
            stripe_subscription_id: "demo_sub_id",
            stripe_customer_id: "demo_customer_id",
            stripe_price_id: "demo_price_id",
            current_period_start: new Date("2026-01-01"),
            current_period_end: new Date("2026-12-31"),
        }
    });

    // Chat history
    const chatRoom = await prisma.chatRoom.create({
        data: {
            user_id: DEMO_USER_ID,
            title: "Kulujen analysointi",
        }
    });

    await prisma.chatMessage.createMany({
        data: [
            { chatroom_id: chatRoom.id, role: "USER", content: "Paljonko olen käyttänyt kuluihin tänä vuonna?" },
            { chatroom_id: chatRoom.id, role: "ASSISTANT", content: "Tänä vuonna kuluja on kirjattu yhteensä 985,80 €. Suurimmat kulut ovat Gigantti 367,00 € (toukokuu) ja Power 349,00 € (kesäkuu). Lisäksi tammikuussa Verkkokauppa.com 119,90 € ja Fonum Kirjakauppa 149,90 €." },
            { chatroom_id: chatRoom.id, role: "USER", content: "Mikä on maksettava ALV Q2:lla?" },
            { chatroom_id: chatRoom.id, role: "ASSISTANT", content: "Q2 2026 maksettava ALV on 1 236,62 €. Myynnin ALV oli 1 382,10 € (Koodikulma Labs ja Koodikulma Software) ja ostojen vähennettävä ALV 145,48 € (Gigantti ja Power). Erotus 1 382,10 € − 145,48 € = 1 236,62 €." },
        ]
    });

    console.log("Demo data seeded successfully!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());