"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptQueue = void 0;
const bullmq_1 = require("bullmq");
// Create a BullMQ queue for processing receipt jobs and AI chat messages
exports.receiptQueue = new bullmq_1.Queue("receiptQueue", {
    connection: {
        url: process.env.REDIS_URL,
    },
});
const chatQueue = new bullmq_1.Queue("chatQueue", {
    connection: {
        url: process.env.REDIS_URL,
    },
});
const clearQueue = async () => {
    await exports.receiptQueue.drain();
    await exports.receiptQueue.clean(0, 100, "failed");
    await chatQueue.drain();
    await chatQueue.clean(0, 100, "failed");
};
clearQueue().catch(console.error);
