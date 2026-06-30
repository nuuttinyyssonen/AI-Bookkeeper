import { z } from 'zod';

export const categorySchema = z.object({
    category: z.string().min(3, "Invalid category")
});

export const isDeductibleSchema = z.object({
    isDeductible: z.boolean()
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