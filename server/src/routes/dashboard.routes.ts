import { Router } from "express";
import { getDashboardData, getCashFlowData } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/authentication";

const dashboardRouter = Router();

dashboardRouter.get("/", authMiddleware, getDashboardData);
dashboardRouter.get('/cashflow', authMiddleware, getCashFlowData);

export default dashboardRouter;