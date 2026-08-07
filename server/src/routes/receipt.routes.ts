import { Router } from "express";
import { getAllReceiptsByUserId, 
    getReceiptById, 
    getReceiptStatus, 
    changeReceiptCategory, 
    changeReceiptDeductible, 
    updateReceipt,
    changeReceiptDeductibilityPercentage,
    exportReceiptsToExcel
} from "../controllers/receipt.controller";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";
import { demoMiddleware } from "../middleware/demoMiddleware";

// Router
const receiptRouter = Router();

// Routes for fetching receipts, changing receipt category and deductible status, all protected by authentication middleware
receiptRouter.get("/create/excel", demoMiddleware, rateLimiters.write("export_to_excel"), exportReceiptsToExcel);
receiptRouter.get("/:id", demoMiddleware, rateLimiters.read("receipt_by_id"), getReceiptById);
receiptRouter.get("/", demoMiddleware, rateLimiters.read("receipts"), getAllReceiptsByUserId);
receiptRouter.get("/status/:batchId", demoMiddleware, rateLimiters.read("receipt_status"), getReceiptStatus);
receiptRouter.put("/:id", demoMiddleware, rateLimiters.write("receipt_update"), updateReceipt);
receiptRouter.put("/percentage/:id", demoMiddleware, rateLimiters.write("receipt_update_deductibility"), changeReceiptDeductibilityPercentage);
receiptRouter.put("/category/:id", demoMiddleware, rateLimiters.write("receipt_category"), changeReceiptCategory);
receiptRouter.put("/is_deductible/:id", demoMiddleware, rateLimiters.write("receipt_deductible"), changeReceiptDeductible);

export default receiptRouter;