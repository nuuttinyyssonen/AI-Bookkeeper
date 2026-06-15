import { Router } from "express";
import { getAllReceiptsByUserId, getReceiptById, getReceiptStatus, changeReceiptCategory, changeReceiptDeductible } from "../controllers/receipt.controller";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const receiptRouter = Router();

// Routes for fetching receipts, changing receipt category and deductible status, all protected by authentication middleware
receiptRouter.get("/:id", authMiddleware, rateLimiters.read("receipt_by_id"), getReceiptById);
receiptRouter.get("/", authMiddleware, rateLimiters.read("receipts"), getAllReceiptsByUserId);
receiptRouter.get("/status/:batchId", authMiddleware, rateLimiters.read("receipt_status"), getReceiptStatus);
receiptRouter.put("/category/:id", authMiddleware, rateLimiters.write("receipt_category"), changeReceiptCategory);
receiptRouter.put("/is_deductible/:id", authMiddleware, rateLimiters.write("receipt_deductible"), changeReceiptDeductible);

export default receiptRouter;