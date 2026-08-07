import { createReport, getReports, getReportById, getReportPdf, deleteReportById, updateReportVatDeclarationSent, getReportPdfUrl } from "../controllers/report.controller";
import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";
import { requireSubscription } from "../middleware/subscription";
import { demoMiddleware } from "../middleware/demoMiddleware";

// Router
const reportRouter = Router();

// Create report, get all reports, get report by ID, and get report PDF routes with authentication and rate limiting
reportRouter.post('/', demoMiddleware, rateLimiters.write("report"), createReport);
reportRouter.get('/', demoMiddleware, rateLimiters.read("reports"), getReports);
reportRouter.get('/:id', demoMiddleware, rateLimiters.read("report_by_id"), getReportById);
reportRouter.get('/:id/pdf', demoMiddleware, rateLimiters.read("report_pdf"), getReportPdf);
reportRouter.get('/:id/pdf/url', demoMiddleware, rateLimiters.read("report_pdf"), getReportPdfUrl);
reportRouter.delete("/:id", demoMiddleware, rateLimiters.read("report_delete"), deleteReportById);
reportRouter.put('/:id/declaration-sent', demoMiddleware, rateLimiters.write('declaration_sent'), updateReportVatDeclarationSent);

export default reportRouter;