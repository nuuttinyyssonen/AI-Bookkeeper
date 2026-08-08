"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_controller_1 = require("../controllers/login.controller");
const express_1 = require("express");
const rateLimiter_1 = require("../utils/rateLimiter");
// Router
const loginRouter = (0, express_1.Router)();
// Route uses loginController and logs user in
loginRouter.post("/", rateLimiter_1.rateLimiters.sensitive("login"), login_controller_1.loginController);
exports.default = loginRouter;
