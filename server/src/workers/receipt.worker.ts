import { Worker } from "bullmq";
import { analyzeReceipt } from "../services/ocr.service";
import { parseReceiptData } from "../services/openai.service";
import { downloadFileFromSupabase } from "../services/supabase.service";

const worker = new Worker(
  "receiptQueue",
  async job => {
    const { filePath } = job.data as { filePath?: string };

    if (!filePath) {
      throw new Error("Receipt worker job missing filePath");
    }

    const fileBuffer = await downloadFileFromSupabase(filePath);
    const { fullText } = await analyzeReceipt(fileBuffer);

    const aiData = await parseReceiptData(fullText);

    return aiData;
  },
  {
    connection: { host: "localhost", port: 6379 }
  }
);

worker.on("completed", job => {
  console.log("JOB DONE", job.id);
});

worker.on("failed", (job, err) => {
  console.log("JOB FAILED", job?.id, err);
});