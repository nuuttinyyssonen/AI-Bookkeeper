"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSubscription = void 0;
const prisma_1 = require("../lib/prisma");
const error_1 = require("../utils/error");
const requireSubscription = async (req, res, next) => {
    const user = req.user;
    try {
        const subscription = await prisma_1.prisma.subscription.findUnique({ where: { user_id: user.id } });
        if (!subscription) {
            return next(new error_1.AuthorizationError("Subscription not found"));
        }
        const isActive = subscription.subscription_status === 'ACTIVE' || subscription.subscription_status === 'TRIALING';
        const isCancelledButValid = subscription.subscription_status === 'CANCELLED' &&
            subscription.current_period_end !== null &&
            subscription.current_period_end > new Date();
        if (!isActive && !isCancelledButValid) {
            return next(new error_1.AuthorizationError("Subscription expired"));
        }
        next();
    }
    catch (error) {
        return next(new error_1.ServerError("Failed to verify subscription"));
    }
};
exports.requireSubscription = requireSubscription;
