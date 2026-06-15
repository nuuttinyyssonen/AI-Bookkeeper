import { Queue } from "bullmq";

// Create a BullMQ queue for processing receipt jobs
export const receiptQueue = new Queue("receiptQueue", {
    connection: {
        url: process.env.REDIS_URL,
    },
});

export const clearQueue = async () => {
    await receiptQueue.drain();
    await receiptQueue.clean(0, 100, "failed");
};

clearQueue().catch(console.error);