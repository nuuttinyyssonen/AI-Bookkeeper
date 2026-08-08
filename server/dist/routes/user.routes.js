"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const rateLimiter_1 = require("../utils/rateLimiter");
const express_1 = require("express");
const demoMiddleware_1 = require("../middleware/demoMiddleware");
// Router
const userRouter = (0, express_1.Router)();
userRouter.get("/", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("get_user_data"), user_controller_1.getUserData);
userRouter.put("/", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.write("update_user_data"), user_controller_1.updateUserData);
// userRouter.delete("/", authMiddleware, rateLimiters.sensitive("delete_user"), deleteUser);
// userRouter.get("/subscription", authMiddleware, rateLimiters.read("get_subscription"), getUserSubscription);
exports.default = userRouter;
