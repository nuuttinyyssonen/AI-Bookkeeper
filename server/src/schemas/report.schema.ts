import { z } from "zod";

export const timePeriodSchema = z.object({
    timePeriod: z.string().min(2, "Invalid time period")
});