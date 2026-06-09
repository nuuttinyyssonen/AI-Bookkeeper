import { createReport } from "../controllers/report.controller";
import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";

const reportRouter = Router();

reportRouter.post('/', authMiddleware, createReport);

export default reportRouter;