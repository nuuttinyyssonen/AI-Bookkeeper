import { z } from "zod";

export const idSchema = z.object({
    id: z.uuid("Invalid ID format")
});

export const batchIdSchema = z.object({
    batchId: z.uuid("Invalid Batch ID format")
});

export const receiptIdSchema = z.object({
    receipt_id: z.string().uuid("Invalid receipt ID")
});