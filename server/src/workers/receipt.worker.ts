import { Worker } from "bullmq";
import { analyzeReceipt } from "../services/ocr.service";
import { parseReceiptData } from "../services/openai.service";
import { downloadFileFromSupabase } from "../services/supabase.service";
import { prisma } from "../lib/prisma";
import { ReceiptType } from "@prisma/client";

// Retry logic with exponential backoff for handling race conditions
const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxAttempts: number = 5,
  initialDelayMs: number = 1000
): Promise<any> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      
      // Don't retry on non-transient errors
      if (err && err.__isStorageError && err.status && ![404, 400].includes(err.status)) {
        throw err;
      }
      
      if (attempt < maxAttempts) {
        const delayMs = initialDelayMs * Math.pow(2, attempt - 1);
        console.log(
          `Receipt worker: attempt ${attempt} failed, retrying in ${delayMs}ms:`,
          err?.message
        );
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError;
};

const worker = new Worker(
  "receiptQueue",
  async job => {
    const { filePath } = job.data as { filePath?: string };
    const { receipt_type } = job.data as { receipt_type?: string };

    if (!filePath) {
      throw new Error("Receipt worker job missing filePath");
    }

    let fileBuffer;
    try {
      fileBuffer = await retryWithBackoff(
        () => downloadFileFromSupabase(filePath),
        5,
        500
      );
    } catch (err: any) {
      if (err && err.__isStorageError && (err.status === 400 || err.status === 404)) {
        console.log("Receipt worker: file not found in storage after retries", filePath, err);
        throw new Error(`File not found in storage: ${filePath}`);
      }
      console.log("Receipt worker: error downloading file", filePath, err);
      throw err;
    }

    const document = await retryWithBackoff(
      () =>
        prisma.document.findFirst({
          where: {
            file_path: filePath
          }
        }),
      5,
      500
    );

    if (!document?.id || !document?.user_id) {
      throw new Error("Missing document data");
    }

    await prisma.document.update({
        where: { id: document.id },
        data: { status: "PROCESSING" }
    });

    const { fullText } = await analyzeReceipt(fileBuffer, document?.document_type ?? undefined);
    const aiData = await parseReceiptData(fullText);

    try {
      const data = {
        document_id: document.id,
        user_id: document.user_id,
        vendor_name: aiData.vendor,
        total_amount: aiData.total,
        receipt_date: new Date(aiData.date),
        receipt_type: (receipt_type as ReceiptType) ?? ReceiptType.EXPENSE,

        receiptVats: {
          create: aiData.vat.map((v: any) => ({
            rate: v.rate,
            net_amount: v.net,
            vat_amount: v.vat_amount,
            total: v.total
          }))
        }
      };

      const receipt = await prisma.receipt.create({ data });

      await prisma.document.update({
          where: { id: document.id },
          data: { status: "COMPLETED" }
      });

      return receipt;
    } catch (err) {
      console.log("Receipt worker: error parsing receipt data with OpenAI", err);
      throw err;
    }
  },
  {
    connection: { host: "localhost", port: 6379 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 }
  }
);

worker.on("completed", job => {
  console.log("JOB DONE", job.id);
});

worker.on("failed", (job, err) => {
  console.log("JOB FAILED", job?.id, err);
});