"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const demoMiddleware_1 = require("../middleware/demoMiddleware");
const rateLimiter_1 = require("../utils/rateLimiter");
// Router
const dashboardRouter = (0, express_1.Router)();
// Routes for fetching dashboard data and cash flow data, protected by authentication middleware
dashboardRouter.get("/", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("dashboard"), dashboard_controller_1.getDashboardData);
dashboardRouter.get('/cashflow', demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("cashflow"), dashboard_controller_1.getCashFlowData);
exports.default = dashboardRouter;
