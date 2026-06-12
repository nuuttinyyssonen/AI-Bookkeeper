import { z } from "zod";

export const idSchema = z.object({
    id: z.uuid("Invalid ID format")
});