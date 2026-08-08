"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionStatusByParams = exports.getSubscriptionStatus = exports.revokeSubscription = exports.changeSubscription = exports.deleteSubscription = exports.createCheckoutSession = void 0;
const prisma_1 = require("../lib/prisma");
const stripe_service_1 = require("../services/stripe.service");
const subscription_schema_1 = require("../schemas/subscription.schema");
const error_1 = require("../utils/error");
const PRICE_IDS = {
    BASIC: process.env.STRIPE_BASIC_PRICE_ID,
    PREMIUM: process.env.STRIPE_PREMIUM_PRICE_ID,
    BASIC_YEARLY: process.env.STRIPE_BASIC_YEARLY_PRICE_ID,
    PREMIUM_YEARLY: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID,
};
const MOBILE_APP_SCHEME = "aibookkeeper";
/**
 * Creates a Stripe Checkout session for a new subscription.
 * @param {Request} req.body - Subscription type and user id
 * @returns 200 with the Stripe checkout session URL
 * @throws {ValidationError} 400 - If body fails validation or price id is not configured
 * @throws {Error} 500 - If Stripe session creation fails
 */
const createCheckoutSession = async (req, res, next) => {
    // Validating subscription type with zod
    const result = subscription_schema_1.checkoutSchema.safeParse(req.body);
    if (!result.success) {
        return next(new error_1.ValidationError(result.error.issues[0].message));
    }
    const { subscriptionType, user_id, platform } = result.data;
    const priceId = PRICE_IDS[subscriptionType];
    if (!priceId) {
        return next(new error_1.ValidationError("Price id is not valid"));
    }
    // Mobile has no web page to redirect back to, so Stripe redirects into the app via a deep link instead
    const { successUrl, cancelUrl } = platform === "mobile"
        ? { successUrl: `${MOBILE_APP_SCHEME}://checkout-success`, cancelUrl: `${MOBILE_APP_SCHEME}://checkout-cancel` }
        : { successUrl: `${process.env.CLIENT_URL}/login?message=subscription-activated`, cancelUrl: `${process.env.CLIENT_URL}/signup` };
    try {
        const session = await stripe_service_1.stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: { user_id, subscriptionType },
        });
        return res.json({ url: session.url });
    }
    catch (error) {
        return next(error);
    }
};
exports.createCheckoutSession = createCheckoutSession;
/**
 * Cancels the authenticated user's subscription at the end of the current billing period.
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with success message
 * @throws {NotFoundError} 404 - If user has no subscription
 * @throws {Error} 500 - If Stripe update fails
 */
const deleteSubscription = async (req, res, next) => {
    const user = req.user;
    const subscription = await prisma_1.prisma.subscription.findUnique({ where: { user_id: user.id } });
    if (!subscription) {
        return next(new error_1.NotFoundError("Subscription not found"));
    }
    try {
        await stripe_service_1.stripe.subscriptions.update(subscription.stripe_subscription_id, {
            cancel_at_period_end: true
        });
        return res.json({ message: 'Subscription will be cancelled at end of billing period' });
    }
    catch (error) {
        return next(error);
    }
};
exports.deleteSubscription = deleteSubscription;
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
const changeSubscription = async (req, res, next) => {
    const user = req.user;
    // Validating subscription type with zod
    const result = subscription_schema_1.subscriptionTypeSchema.safeParse(req.body);
    if (!result.success) {
        return next(new error_1.ValidationError(result.error.issues[0].message));
    }
    const { subscriptionType } = result.data;
    const subscription = await prisma_1.prisma.subscription.findUnique({ where: { user_id: user.id } });
    if (!subscription) {
        return next(new error_1.NotFoundError("Susbcription not found"));
    }
    const PRICE_IDS = {
        BASIC: process.env.STRIPE_BASIC_PRICE_ID,
        PREMIUM: process.env.STRIPE_PREMIUM_PRICE_ID,
        BASIC_YEARLY: process.env.STRIPE_BASIC_YEARLY_PRICE_ID,
        PREMIUM_YEARLY: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID,
    };
    const newPriceId = PRICE_IDS[subscriptionType];
    if (!newPriceId) {
        return next(new error_1.ValidationError("Invalid subscription type"));
    }
    try {
        // Update the subscription in Stripe
        const stripeSubscription = await stripe_service_1.stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
        await stripe_service_1.stripe.subscriptions.update(subscription.stripe_subscription_id, {
            items: [{
                    id: stripeSubscription.items.data[0].id,
                    price: newPriceId,
                }],
            proration_behavior: 'always_invoice', // charges/credits difference immediately
        });
        // Update in database
        await prisma_1.prisma.subscription.update({
            where: { user_id: user.id },
            data: {
                subscription_type: subscriptionType,
                stripe_price_id: newPriceId,
            },
        });
        return res.json({ message: 'Subscription is updated successfully' });
    }
    catch (error) {
        return next(error);
    }
};
exports.changeSubscription = changeSubscription;
/**
 * Reactivates a subscription that was previously scheduled for cancellation.
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with success message
 * @throws {NotFoundError} 404 - If user has no subscription
 * @throws {Error} 500 - If Stripe update fails
 */
const revokeSubscription = async (req, res, next) => {
    const user = req.user;
    const subscription = await prisma_1.prisma.subscription.findUnique({ where: { user_id: user.id } });
    if (!subscription) {
        return next(new error_1.NotFoundError("Subscription not found"));
    }
    try {
        await stripe_service_1.stripe.subscriptions.update(subscription.stripe_subscription_id, {
            cancel_at_period_end: false
        });
        return res.json({ message: 'Subscription reactivated' });
    }
    catch (error) {
        return next(error);
    }
};
exports.revokeSubscription = revokeSubscription;
/**
 * Retrieves the authenticated user's subscription status.
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with `{ subscription }`, or a message if no subscription exists
 * @throws {Error} 500 - If database query fails
 */
const getSubscriptionStatus = async (req, res, next) => {
    const user = req.user;
    try {
        const subscription = await prisma_1.prisma.subscription.findUnique({ where: { user_id: user.id } });
        if (!subscription) {
            return res.json({ message: "You don't have an active subscription" });
        }
        return res.status(200).json({ subscription });
    }
    catch (error) {
        return next(error);
    }
};
exports.getSubscriptionStatus = getSubscriptionStatus;
/**
 * Retrieves the user's subscription status in mobile checkout.
 * @param {Request} req.query - Gets user id from query params
 * @returns 200 with `{ subscription }`, or a message if no subscription exists
 * @throws {Error} 500 - If database query fails
 */
const getSubscriptionStatusByParams = async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const subscription = await prisma_1.prisma.subscription.findUnique({ where: { user_id: user_id } });
        if (!subscription) {
            return res.json({ message: "You don't have an active subscription" });
        }
        return res.status(200).json({ hasSubscription: !!subscription });
    }
    catch (error) {
        return next(error);
    }
};
exports.getSubscriptionStatusByParams = getSubscriptionStatusByParams;
