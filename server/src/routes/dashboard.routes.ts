import { Router } from "express";
import { getDashboardData, getCashFlowData } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/authentication";
import { demoMiddleware } from "../middleware/demoMiddleware";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const dashboardRouter = Router();

// Routes for fetching dashboard data and cash flow data, protected by authentication middleware
dashboardRouter.get("/", demoMiddleware, rateLimiters.read("dashboard"), getDashboardData);
dashboardRouter.get('/cashflow', demoMiddleware, rateLimiters.read("cashflow"), getCashFlowData);

export default dashboardRouter;