import { createReport, getReports, getReportById, getReportPdf, deleteReportById, updateReportVatDeclarationSent } from "../controllers/report.controller";
import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";
import { requireSubscription } from "../middleware/subscription";

// Router
const reportRouter = Router();

// Create report, get all reports, get report by ID, and get report PDF routes with authentication and rate limiting
reportRouter.post('/', authMiddleware, requireSubscription, rateLimiters.write("report"), createReport);
reportRouter.get('/', authMiddleware, rateLimiters.read("reports"), getReports);
reportRouter.get('/:id', authMiddleware, rateLimiters.read("report_by_id"), getReportById);
reportRouter.get('/:id/pdf', authMiddleware, rateLimiters.read("report_pdf"), getReportPdf);
reportRouter.delete("/:id", authMiddleware, rateLimiters.read("report_delete"), deleteReportById);
reportRouter.put('/:id/declaration-sent', authMiddleware, rateLimiters.write('declaration_sent'), updateReportVatDeclarationSent);

export default reportRouter;