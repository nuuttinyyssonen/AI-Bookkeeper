import { createReport, getReports, getReportById } from "../controllers/report.controller";
import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";

const reportRouter = Router();

reportRouter.post('/', authMiddleware, createReport);
reportRouter.get('/', authMiddleware, getReports);
reportRouter.get('/:id', authMiddleware, getReportById);

export default reportRouter;