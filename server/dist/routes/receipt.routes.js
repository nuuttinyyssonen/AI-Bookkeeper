"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const receipt_controller_1 = require("../controllers/receipt.controller");
const rateLimiter_1 = require("../utils/rateLimiter");
const demoMiddleware_1 = require("../middleware/demoMiddleware");
// Router
const receiptRouter = (0, express_1.Router)();
// Routes for fetching receipts, changing receipt category and deductible status, all protected by authentication middleware
receiptRouter.get("/create/excel", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.write("export_to_excel"), receipt_controller_1.exportReceiptsToExcel);
receiptRouter.get("/:id", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("receipt_by_id"), receipt_controller_1.getReceiptById);
receiptRouter.get("/", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("receipts"), receipt_controller_1.getAllReceiptsByUserId);
receiptRouter.get("/status/:batchId", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("receipt_status"), receipt_controller_1.getReceiptStatus);
receiptRouter.put("/:id", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.write("receipt_update"), receipt_controller_1.updateReceipt);
receiptRouter.put("/percentage/:id", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.write("receipt_update_deductibility"), receipt_controller_1.changeReceiptDeductibilityPercentage);
receiptRouter.put("/category/:id", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.write("receipt_category"), receipt_controller_1.changeReceiptCategory);
receiptRouter.put("/is_deductible/:id", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.write("receipt_deductible"), receipt_controller_1.changeReceiptDeductible);
exports.default = receiptRouter;
