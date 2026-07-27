import { Router } from "express";
import { createCheckoutSession, deleteSubscription, changeSubscription, revokeSubscription, getSubscriptionStatus, getSubscriptionStatusByParams } from "../controllers/subscription.controller";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const subscriptionRouter = Router();

subscriptionRouter.post('/create-checkout-session', rateLimiters.sensitive("SubscriptionCheckout"), createCheckoutSession);
subscriptionRouter.delete('/delete', authMiddleware, rateLimiters.sensitive("deleteSubscription"), deleteSubscription);
subscriptionRouter.put('/change-plan', authMiddleware, rateLimiters.sensitive("changePlan"), changeSubscription);
subscriptionRouter.put('/revoke-plan', authMiddleware, rateLimiters.sensitive("revokePlan"), revokeSubscription);
subscriptionRouter.get('/status', authMiddleware, rateLimiters.read("subscriptionStatus"), getSubscriptionStatus);
subscriptionRouter.get('/status/:user_id', rateLimiters.read("subscriptionStatusByParams"), getSubscriptionStatusByParams);

export default subscriptionRouter;