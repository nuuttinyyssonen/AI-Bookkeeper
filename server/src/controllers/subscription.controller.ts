import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { stripe } from "../services/stripe.service";
import { subscriptionTypeSchema, checkoutSchema } from "../schemas/subscription.schema";
import { NotFoundError, ValidationError } from "../utils/error";
import { SubscriptionType } from "@prisma/client";

const PRICE_IDS = {
    BASIC: process.env.STRIPE_BASIC_PRICE_ID,
    PREMIUM: process.env.STRIPE_PREMIUM_PRICE_ID,
    BASIC_YEARLY: process.env.STRIPE_BASIC_YEARLY_PRICE_ID,
    PREMIUM_YEARLY: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID,
};

/**
 * Creates a Stripe Checkout session for a new subscription.
 * @param {Request} req.body - Subscription type and user id
 * @returns 200 with the Stripe checkout session URL
 * @throws {ValidationError} 400 - If body fails validation or price id is not configured
 * @throws {Error} 500 - If Stripe session creation fails
 */
export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
    // Validating subscription type with zod
    const result = checkoutSchema.safeParse(req.body);

    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { subscriptionType, user_id } = result.data;
    const priceId = PRICE_IDS[subscriptionType as SubscriptionType];
    if(!priceId) {
        return next(new ValidationError("Price id is not valid"));
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.CLIENT_URL}/login?message=subscription-activated`,
            cancel_url: `${process.env.CLIENT_URL}/signup`,
            metadata: { user_id, subscriptionType },
        });

        return res.json({ url: session.url });
    } catch(error) {
        return next(error);
    }
};

/**
 * Cancels the authenticated user's subscription at the end of the current billing period.
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with success message
 * @throws {NotFoundError} 404 - If user has no subscription
 * @throws {Error} 500 - If Stripe update fails
 */
export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const subscription = await prisma.subscription.findUnique({ where: { user_id: user.id } });
    if(!subscription) {
        return next(new NotFoundError("Subscription not found"));
    }
    try {
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
            cancel_at_period_end: true
        });

        return res.json({ message: 'Subscription will be cancelled at end of billing period' });
    } catch(error) {
        return next(error);
    }
};

/**
 * Changes the authenticated user's subscription plan, updating the price in Stripe
 * (with immediate proration) and the subscription record in the database.
 * @param {Request} req.user - User from auth middleware
 * @param {Request} req.body - New subscription type
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If subscription type fails validation or is invalid
 * @throws {NotFoundError} 404 - If user has no subscription
 * @throws {Error} 500 - If Stripe or database update fails
 */
export const changeSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    // Validating subscription type with zod
    const result = subscriptionTypeSchema.safeParse(req.body);
    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { subscriptionType } = result.data;

    const subscription = await prisma.subscription.findUnique({ where: { user_id: user.id } });
    if(!subscription) {
        return next(new NotFoundError("Susbcription not found"));
    }

    const PRICE_IDS: Record<string, string> = {
        BASIC: process.env.STRIPE_BASIC_PRICE_ID!,
        PREMIUM: process.env.STRIPE_PREMIUM_PRICE_ID!,
        BASIC_YEARLY: process.env.STRIPE_BASIC_YEARLY_PRICE_ID!,
        PREMIUM_YEARLY: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!,
    };

    const newPriceId = PRICE_IDS[subscriptionType];

    if (!newPriceId) {
        return next(new ValidationError("Invalid subscription type"));
    }


    try {
        // Update the subscription in Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(
            subscription.stripe_subscription_id
        );
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
            items: [{
            id: stripeSubscription.items.data[0].id,
            price: newPriceId,
            }],
            proration_behavior: 'always_invoice', // charges/credits difference immediately
        });

        // Update in database
        await prisma.subscription.update({
            where: { user_id: user.id },
            data: {
            subscription_type: subscriptionType as SubscriptionType,
            stripe_price_id: newPriceId,
            },
        });
        return res.json({ message: 'Subscription is updated successfully' });
    } catch(error) {
        return next(error);
    }
};

/**
 * Reactivates a subscription that was previously scheduled for cancellation.
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with success message
 * @throws {NotFoundError} 404 - If user has no subscription
 * @throws {Error} 500 - If Stripe update fails
 */
export const revokeSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const subscription = await prisma.subscription.findUnique({ where: { user_id: user.id } });
    if(!subscription) {
        return next(new NotFoundError("Subscription not found"));
    }
    try {
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
            cancel_at_period_end: false
        });

        return res.json({ message: 'Subscription reactivated' });
    } catch(error) {
        return next(error);
    }
};

/**
 * Retrieves the authenticated user's subscription status.
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with `{ subscription }`, or a message if no subscription exists
 * @throws {Error} 500 - If database query fails
 */
export const getSubscriptionStatus = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        const subscription = await prisma.subscription.findUnique({ where: { user_id: user.id } });
        if(!subscription) {
            return res.json({ message: "You don't have an active subscription" });
        }
        return res.status(200).json({ subscription });
    } catch(error) {
        return next(error);
    }
};