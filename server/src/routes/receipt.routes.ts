import { Router } from "express";
import { getAllReceiptsByUserId, getReceiptById, deleteReceipById } from "../controllers/receipt.controller";
import { authMiddleware } from "../middleware/authentication";

const receiptRouter = Router();

receiptRouter.get("/:id", authMiddleware, getReceiptById);
receiptRouter.get("/", authMiddleware, getAllReceiptsByUserId);
receiptRouter.delete("/:id", authMiddleware, deleteReceipById);

export default receiptRouter;