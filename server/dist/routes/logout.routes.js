"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logout_controller_1 = require("../controllers/logout.controller");
const rateLimiter_1 = require("../utils/rateLimiter");
// Router
const logoutRouter = (0, express_1.Router)();
// Uses logoutController that clears cookie and logs user out from Supabase.
logoutRouter.post('/', rateLimiter_1.rateLimiters.write("logout"), logout_controller_1.logoutController);
exports.default = logoutRouter;
