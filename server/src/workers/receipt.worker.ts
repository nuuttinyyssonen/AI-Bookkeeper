import { Worker } from "bullmq";
import { analyzeReceipt } from "../services/ocr.service";
import { parseReceiptData } from "../services/openai.service";
import { downloadFileFromSupabase } from "../services/supabase.service";
import { prisma } from "../lib/prisma";

const worker = new Worker(
  "receiptQueue",
  async job => {
    const { filePath } = job.data as { filePath?: string };

    if (!filePath) {
      throw new Error("Receipt worker job missing filePath");
    }

    let fileBuffer;
    try {
      fileBuffer = await downloadFileFromSupabase(filePath);
    } catch (err: any) {
      if (err && err.__isStorageError && (err.status === 400 || err.status === 404)) {
        console.log("Receipt worker: file not found in storage", filePath, err);
        throw new Error(`File not found in storage: ${filePath}`);
      }
      console.log("Receipt worker: error downloading file", filePath, err);
      throw err;
    }
    const document = await prisma.document.findFirst({
          where: {
            file_path: filePath
          }
      });

    if (!document?.id || !document?.user_id) {
      throw new Error("Missing document data");
    }

    const { fullText } = await analyzeReceipt(fileBuffer, document?.document_type ?? undefined);
    const aiData = await parseReceiptData(fullText);

    try {
      const data = {
        document_id: document.id,
        user_id: document.user_id,
        vendor_name: aiData.vendor,
        total_amount: aiData.total,
        receipt_date: new Date(aiData.date),

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

      const queriedDocument = await prisma.receipt.findUnique({
        where: {
          id: receipt.id
        },
        include: {
          receiptVats: true
        }
      });
      console.log(queriedDocument?.receiptVats);
      return receipt;
    } catch (err) {
      console.log("Receipt worker: error parsing receipt data with OpenAI", err);
      throw err;
    }
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