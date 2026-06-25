import { stripe } from "../services/stripe.service";
import Stripe from 'stripe';
import { prisma } from "../lib/prisma";
import { Request, Response, NextFunction } from "express";
import { SubscriptionStatus, SubscriptionType } from "@prisma/client";

export const webhookEndpoint = async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        return res.status(400).json({ error: 'Webhook signature invalid' });
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

            const item = subscription.items.data[0];
            const periodStart = item.current_period_start;
            const periodEnd = item.current_period_end;  

            await prisma.subscription.create({
                data: {
                    stripe_subscription_id: subscription.id,
                    stripe_customer_id: session.customer as string,
                    stripe_price_id: item.price.id,
                    subscription_type: session.metadata!.subscriptionType as SubscriptionType,
                    subscription_status: SubscriptionStatus.ACTIVE,
                    current_period_start: new Date(periodStart * 1000),
                    current_period_end: new Date(periodEnd * 1000),
                    user_id: session.metadata!.user_id,
                },
            });
            break;
        }

        case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice;
            const subscriptionId = (invoice as any).subscription ?? 
                (invoice.parent?.type === 'subscription_details' 
                ? invoice.parent.subscription_details?.subscription 
                : null);

            const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
            const item = subscription.items.data[0];

            await prisma.subscription.update({
                where: { stripe_subscription_id: subscription.id },
                data: {
                    current_period_start: new Date(item.current_period_start * 1000),
                    current_period_end: new Date(item.current_period_end * 1000),
                    subscription_status: SubscriptionStatus.ACTIVE,
                },
            });
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;

            await prisma.subscription.update({
                where: { stripe_subscription_id: subscription.id },
                data: {
                    subscription_status: SubscriptionStatus.CANCELLED,
                    ended_at: new Date(),
                },
            });
            break;
        }
    }
    res.json({ received: true });
};