import { z } from "zod";

export const subscriptionTypeSchema = z.object({
    subscriptionType: z.string().min(1).max(1000, "Invalid subscription type")
});