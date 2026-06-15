import { Router } from "express";
import { getVatById, getVatsByReceiptId } from "../controllers/vats.controller";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const vatsRouter = Router();

// Get VATs by receipt ID and get VAT by VAT ID routes with authentication and rate limiting
vatsRouter.get("/:receipt_id", authMiddleware, rateLimiters.read("vats_by_receipt"), getVatsByReceiptId);
vatsRouter.get("/:id", authMiddleware, rateLimiters.read("vat_by_id"), getVatById);