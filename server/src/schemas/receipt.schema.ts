import { z } from 'zod';

export const categorySchema = z.object({
    category: z.string().min(3, "Invalid category")
});

export const isDeductibleSchema = z.object({
    isDeductible: z.boolean()
});

export const deductibilityPercentageSchema = z.object({
  deductibilityPercentage: z
    .number()
    .min(0, "Percentage must be at least 0")
    .max(100, "Percentage must be 100 or lower")
});

export const updateReceiptSchema = z.object({
    vendor_name: z.string().min(1, "Vendor name is required"),
    total_amount: z.number({ error: "Total amount must be a number" }).positive("Total amount must be positive"),
    receipt_date: z.string().min(1, "Date is required"),
    vats: z.array(z.object({
        id: z.string(),
        rate: z.number(),
        net_amount: z.number(),
        vat_amount: z.number(),
        total: z.number(),
    })).optional(),
});

export const receiptQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    from: z.string().optional(),
    to: z.string().optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    type: z.enum(["EXPENSE", "INCOME"]).optional(),
});