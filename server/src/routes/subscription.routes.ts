import { Router } from "express";
import { createCheckoutSession } from "../controllers/subscription.controller";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const subscriptionRouter = Router();

subscriptionRouter.post('/create-checkout-session', authMiddleware, rateLimiters.sensitive("SubscriptionCheckout"), createCheckoutSession);

export default subscriptionRouter;