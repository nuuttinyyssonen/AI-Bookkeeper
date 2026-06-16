import { Worker } from "bullmq";
import logger from "../lib/logger";

// worker for ai assistance chat messages
export const chatWorker = new Worker(
    "chatQueue",
    async job => {

    }
);

// Event listeners for logging job completion and failures
chatWorker.on("completed", job => {
  logger.info({
        message: "Receipt job completed",
        jobId: job.id,
        filePath: job.data.filePath
    });
});

chatWorker.on("failed", (job, err) => {
  logger.error({
        message: "Receipt job failed",
        jobId: job?.id,
        filePath: job?.data.filePath,
        error: err.message,
        stack: err.stack
    });
});