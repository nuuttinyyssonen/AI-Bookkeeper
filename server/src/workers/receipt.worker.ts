import { Worker } from "bullmq";
import { analyzeReceipt } from "../services/ocr.service";
import { parseReceiptData } from "../services/openai.service";
import { downloadFileFromSupabase } from "../services/supabase.service";
import { prisma } from "../lib/prisma";
import { ReceiptType, CategoryType } from "@prisma/client";
import logger from "../lib/logger";

// Retry logic with exponential backoff for handling race conditions
const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxAttempts: number = 5,
  initialDelayMs: number = 1000
): Promise<any> => {
  let lastError: any;
  
  // loop to retry the function with exponential backoff
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
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError;
};

const worker = new Worker(
  "receiptQueue",
  async job => {

    // Extract filePath and receipt_type from job data
    const { filePath } = job.data as { filePath?: string };
    const { receipt_type } = job.data as { receipt_type?: string };

    // Winston logging
    logger.info({ message: "Processing receipt", filePath, jobId: job.id });

    if (!filePath) {
      throw new Error("Receipt worker job missing filePath");
    }

    let fileBuffer;

    // First, try to download the file with retries to handle potential race conditions
    try {
      fileBuffer = await retryWithBackoff(
        () => downloadFileFromSupabase(filePath),
        5,
        500
      );
    } catch (err: any) {
      // If the error indicates the file is not found after retries, log and throw a specific error
      if (err && err.__isStorageError && (err.status === 400 || err.status === 404)) {
        throw new Error(`File not found in storage: ${filePath}`);
      }
      throw err;
    }

    // After successfully downloading the file, we can proceed to find the document record in the database
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

    // Update document status to "PROCESSING" before starting analysis
    await prisma.document.update({
        where: { id: document.id },
        data: { status: "PROCESSING" }
    });

    // Fetch categories to pass to OpenAI for better parsing accuracy
    const categories = await prisma.category.findMany({ select: { type: true } });
    const categoryTypes = categories.map(c => c.type);

    // Analyze the receipt with OCR and parse data with OpenAI
    const { fullText } = await analyzeReceipt(fileBuffer, document?.document_type ?? undefined);
    const aiData = await parseReceiptData(fullText, categoryTypes, receipt_type ?? 'EXPENSE');

    // Find the category in the database based on AI-parsed category, fallback to "MUUT_KULUT" if not found
    // or if the AI returned a category that isn't a valid CategoryType
    const category = (aiData.category && categoryTypes.includes(aiData.category)
        ? await prisma.category.findUnique({ where: { type: aiData.category } })
        : null) ?? await prisma.category.findUnique({
        where: { type: "MUUT_KULUT" }
    });

    if (!category) {
        throw new Error("No categories found in database");
    }

    try {
      // Create the receipt record in the database with the parsed data
      const data = {
        document_id: document.id,
        user_id: document.user_id,
        vendor_name: aiData.vendor,
        total_amount: aiData.total,
        receipt_date: new Date(aiData.date),
        receipt_type: (receipt_type as ReceiptType) ?? ReceiptType.EXPENSE,
        is_deductible: receipt_type === 'INCOME' ? false : true,
        category_id: category.id,

        // Map AI-parsed VAT data to the receiptVats relation
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

      // Update document status to "COMPLETED" after successful processing
      await prisma.document.update({
          where: { id: document.id },
          data: { status: "COMPLETED" }
      });

      return receipt;
    } catch (err) {
      throw err;
    }
  },
  {
    connection: { host: "localhost", port: 6379 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 }
  }
);

// Event listeners for logging job completion and failures
worker.on("completed", job => {
  logger.info({
        message: "Receipt job completed",
        jobId: job.id,
        filePath: job.data.filePath
    });
});

worker.on("failed", (job, err) => {
  logger.error({
        message: "Receipt job failed",
        jobId: job?.id,
        filePath: job?.data.filePath,
        error: err.message,
        stack: err.stack
    });
});