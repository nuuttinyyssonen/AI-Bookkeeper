import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { stripe } from "../services/stripe.service";
import { subscriptionTypeSchema } from "../schemas/subscription.schema";
import { ValidationError } from "../utils/error";
import { SubscriptionType } from "@prisma/client";

const PRICE_IDS = {
    BASIC: process.env.STRIPE_BASIC_PRICE_ID,
    PREMIUM: process.env.STRIPE_PREMIUM_ID
};

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const user_id = user.id;
    // Validating subscription type with zod
    const result = subscriptionTypeSchema.safeParse(req.body);

    console.log(req.body);

    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { subscriptionType } = result.data;
    const priceId = PRICE_IDS[subscriptionType as SubscriptionType];
    if(!priceId) {
        return next(new ValidationError("Price id is not valid"));
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/pricing`,
            metadata: { user_id, subscriptionType },
        });

        res.json({ url: session.url });
    } catch(error) {
        return next();
    }
};