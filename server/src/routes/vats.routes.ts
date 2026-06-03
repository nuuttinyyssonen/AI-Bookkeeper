import { Router } from "express";
import { getVatById, getVatsByReceiptId } from "../controllers/vats.controller";
import { authMiddleware } from "../middleware/authentication";

const vatsRouter = Router();

vatsRouter.get("/:receipt_id", authMiddleware, getVatsByReceiptId);
vatsRouter.get(":id", authMiddleware, getVatById);