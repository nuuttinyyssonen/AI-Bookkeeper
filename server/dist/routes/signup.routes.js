"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signup_controller_1 = require("../controllers/signup.controller");
const express_1 = require("express");
const rateLimiter_1 = require("../utils/rateLimiter");
// Router
const signupRouter = (0, express_1.Router)();
// Router uses signupController function and creates new user to database.
signupRouter.post("/", rateLimiter_1.rateLimiters.sensitive("signup"), signup_controller_1.signupController);
signupRouter.delete('/:id', rateLimiter_1.rateLimiters.sensitive("signup_fall_back_delete"), signup_controller_1.deleteUser);
exports.default = signupRouter;
