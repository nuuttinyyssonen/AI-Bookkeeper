import { Router } from "express";
import { getAllReceiptsByUserId, getReceiptById, getReceiptStatus } from "../controllers/receipt.controller";
import { authMiddleware } from "../middleware/authentication";

const receiptRouter = Router();

receiptRouter.get("/:id", authMiddleware, getReceiptById);
receiptRouter.get("/", authMiddleware, getAllReceiptsByUserId);
receiptRouter.get("/status/:batchId", authMiddleware, getReceiptStatus);

export default receiptRouter;