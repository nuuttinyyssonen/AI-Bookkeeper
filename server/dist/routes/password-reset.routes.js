"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const password_reset_controller_1 = require("../controllers/password-reset.controller");
const express_1 = require("express");
const rateLimiter_1 = require("../utils/rateLimiter");
// Router
const passwordResetRouter = (0, express_1.Router)();
passwordResetRouter.post('/send-email', rateLimiter_1.rateLimiters.write("send-password-reset-link"), password_reset_controller_1.sendPasswordResetLink);
passwordResetRouter.post('/:id', rateLimiter_1.rateLimiters.write('reset-password'), password_reset_controller_1.resetPassword);
exports.default = passwordResetRouter;
