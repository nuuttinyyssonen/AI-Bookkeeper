import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AuthorizationError, NotFoundError, ServerError } from "../utils/error";

export const requireSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    try {
        const subscription = await prisma.subscription.findUnique({ where: { user_id: user.id } });

        if (!subscription) {
            return next(new AuthorizationError("Subscription not found"));
        }

        const isActive = subscription.subscription_status === 'ACTIVE' || subscription.subscription_status === 'TRIALING';
        const isCancelledButValid = subscription.subscription_status === 'CANCELLED' && 
            subscription.current_period_end !== null && 
            subscription.current_period_end > new Date();

        if (!isActive && !isCancelledButValid) {
            return next(new AuthorizationError("Subscription expired"));
        }

        next();
    } catch (error) {
        return next(new ServerError("Failed to verify subscription"));
    }
};