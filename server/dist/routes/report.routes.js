"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const report_controller_1 = require("../controllers/report.controller");
const express_1 = require("express");
const rateLimiter_1 = require("../utils/rateLimiter");
const demoMiddleware_1 = require("../middleware/demoMiddleware");
// Router
const reportRouter = (0, express_1.Router)();
// Create report, get all reports, get report by ID, and get report PDF routes with authentication and rate limiting
reportRouter.post('/', demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.write("report"), report_controller_1.createReport);
reportRouter.get('/', demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("reports"), report_controller_1.getReports);
reportRouter.get('/:id', demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("report_by_id"), report_controller_1.getReportById);
reportRouter.get('/:id/pdf', demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("report_pdf"), report_controller_1.getReportPdf);
reportRouter.get('/:id/pdf/url', demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("report_pdf"), report_controller_1.getReportPdfUrl);
reportRouter.delete("/:id", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("report_delete"), report_controller_1.deleteReportById);
reportRouter.put('/:id/declaration-sent', demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.write('declaration_sent'), report_controller_1.updateReportVatDeclarationSent);
exports.default = reportRouter;
