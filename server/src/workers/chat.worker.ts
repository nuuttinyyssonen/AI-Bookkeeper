import { Worker } from "bullmq";
import { prisma } from "../lib/prisma";
import { generateChatResponse } from "../services/openai.service";
import logger from "../lib/logger";

export const chatWorker = new Worker(
    "chatQueue",
    async job => {
        const { chatRoomId, message } = job.data;

        // Get chat history for context
        const history = await prisma.chatMessage.findMany({
            where: { chatroom_id: chatRoomId },
            orderBy: { created_at: "asc" },
            take: 20
        });

        const aiResponse = await generateChatResponse(message, history);

        // Save AI response to DB
        await prisma.chatMessage.create({
            data: {
                content: aiResponse ?? "",
                chatroom_id: chatRoomId,
                role: "ASSISTANT"
            }
        });
    },
    {
        connection: { host: "localhost", port: 6379 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 }
    }
);

chatWorker.on("completed", job => {
    logger.info({ message: "Chat job completed", jobId: job.id });
});

chatWorker.on("failed", (job, err) => {
    logger.error({ message: "Chat job failed", jobId: job?.id, error: err.message });
});