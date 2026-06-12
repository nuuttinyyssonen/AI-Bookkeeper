import { z } from 'zod';

export const categorySchema = z.object({
    category: z.string().min(3, "Invalid category")
});

export const isDeductibleSchema = z.object({
    isDeductible: z.boolean()
});