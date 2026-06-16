import { z } from "zod";

export const chatMessageSchema = z.object({
    message: z.string().min(1).max(1000),
    chatRoomID: z.uuid("Invalid ID format")
});