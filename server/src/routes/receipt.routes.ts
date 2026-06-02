import { Router } from "express";
import { getAllReceiptsByUserId, getReceiptByUserId } from "../controllers/receipt.controller";
import { authMiddleware } from "../middleware/authentication";

const receiptRouter = Router();

receiptRouter.get("/:id", authMiddleware, getReceiptByUserId);
receiptRouter.get("/", authMiddleware, getAllReceiptsByUserId);

export default receiptRouter;