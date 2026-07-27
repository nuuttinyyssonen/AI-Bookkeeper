import { z } from "zod";

export const subscriptionTypeSchema = z.object({
    subscriptionType: z.string().min(1).max(20, "Invalid subscription type")
});

export const checkoutSchema = z.object({
    subscriptionType: z.string().min(1).max(20, "Invalid subscription type"),
    user_id: z.uuid("Invalid user_id format"),
    platform: z.enum(["web", "mobile"]).optional()
});