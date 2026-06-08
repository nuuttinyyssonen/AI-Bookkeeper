import { Router } from "express";
import { getAllReceiptsByUserId, getReceiptById, getReceiptStatus, changeReceiptCategory, changeReceiptDeductible } from "../controllers/receipt.controller";
import { authMiddleware } from "../middleware/authentication";

const receiptRouter = Router();

receiptRouter.get("/:id", authMiddleware, getReceiptById);
receiptRouter.get("/", authMiddleware, getAllReceiptsByUserId);
receiptRouter.get("/status/:batchId", authMiddleware, getReceiptStatus);
receiptRouter.put("/category/:id", authMiddleware, changeReceiptCategory);
receiptRouter.put("/is_deductible/:id", authMiddleware, changeReceiptDeductible);

export default receiptRouter;