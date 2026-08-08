"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vats_controller_1 = require("../controllers/vats.controller");
const authentication_1 = require("../middleware/authentication");
const rateLimiter_1 = require("../utils/rateLimiter");
// Router
const vatsRouter = (0, express_1.Router)();
// Get VATs by receipt ID and get VAT by VAT ID routes with authentication and rate limiting
vatsRouter.get("/:receipt_id", authentication_1.authMiddleware, rateLimiter_1.rateLimiters.read("vats_by_receipt"), vats_controller_1.getVatsByReceiptId);
vatsRouter.get("/:id", authentication_1.authMiddleware, rateLimiter_1.rateLimiters.read("vat_by_id"), vats_controller_1.getVatById);
