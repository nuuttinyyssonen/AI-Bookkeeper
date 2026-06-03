import { Router } from "express";
import { getAllReceiptsByUserId, getReceiptById } from "../controllers/receipt.controller";
import { authMiddleware } from "../middleware/authentication";

const receiptRouter = Router();

receiptRouter.get("/:id", authMiddleware, getReceiptById);
receiptRouter.get("/", authMiddleware, getAllReceiptsByUserId);

export default receiptRouter;