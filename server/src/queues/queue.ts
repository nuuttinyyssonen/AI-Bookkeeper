import { Queue } from "bullmq";

export const receiptQueue = new Queue("receiptQueue", {
    connection: {
        url: process.env.REDIS_URL,
    },
});