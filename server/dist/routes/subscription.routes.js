"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_controller_1 = require("../controllers/subscription.controller");
const authentication_1 = require("../middleware/authentication");
const rateLimiter_1 = require("../utils/rateLimiter");
// Router
const subscriptionRouter = (0, express_1.Router)();
subscriptionRouter.post('/create-checkout-session', rateLimiter_1.rateLimiters.sensitive("SubscriptionCheckout"), subscription_controller_1.createCheckoutSession);
subscriptionRouter.delete('/delete', authentication_1.authMiddleware, rateLimiter_1.rateLimiters.sensitive("deleteSubscription"), subscription_controller_1.deleteSubscription);
subscriptionRouter.put('/change-plan', authentication_1.authMiddleware, rateLimiter_1.rateLimiters.sensitive("changePlan"), subscription_controller_1.changeSubscription);
subscriptionRouter.put('/revoke-plan', authentication_1.authMiddleware, rateLimiter_1.rateLimiters.sensitive("revokePlan"), subscription_controller_1.revokeSubscription);
subscriptionRouter.get('/status', authentication_1.authMiddleware, rateLimiter_1.rateLimiters.read("subscriptionStatus"), subscription_controller_1.getSubscriptionStatus);
subscriptionRouter.get('/status/:user_id', rateLimiter_1.rateLimiters.read("subscriptionStatusByParams"), subscription_controller_1.getSubscriptionStatusByParams);
exports.default = subscriptionRouter;
