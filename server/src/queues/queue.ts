import { Queue } from "bullmq";

// Create a BullMQ queue for processing receipt jobs and AI chat messages
export const receiptQueue = new Queue("receiptQueue", {
    connection: {
        url: process.env.REDIS_URL,
    },
});

const chatQueue = new Queue("chatQueue", {
    connection: {
        url: process.env.REDIS_URL,
    },
});

const clearQueue = async () => {
    await receiptQueue.drain();
    await receiptQueue.clean(0, 100, "failed");
    await chatQueue.drain();
    await chatQueue.clean(0, 100, "failed");
};

clearQueue().catch(console.error);