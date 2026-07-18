import { stripe } from "../services/stripe.service";
import Stripe from 'stripe';
import { prisma } from "../lib/prisma";
import { Request, Response, NextFunction } from "express";
import { SubscriptionStatus, SubscriptionType } from "@prisma/client";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Handles incoming Stripe webhook events for subscription lifecycle changes.
 * Verifies the webhook signature, then creates/updates the local subscription record
 * for checkout completion, payment success, cancellation and status/plan updates,
 * emailing the user on cancellation and reactivation.
 * @param {Request} req.body - Raw Stripe event payload
 * @param {Request} req.headers - Stripe signature header used to verify the event
 * @returns 200 with `{ received: true }`
 * @throws {ValidationError} 400 - If Webhook signature is invalid
 */
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

        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;

            const dbSubscription = await prisma.subscription.update({
                where: { stripe_subscription_id: subscription.id },
                data: {
                    cancel_at_period_end: (subscription as any).cancel_at_period_end,
                },
                include: {
                    user: true 
                }
            });

            if ((subscription as any).cancel_at_period_end) {
                const periodEnd = new Date(dbSubscription.current_period_end!).toLocaleDateString('fi-FI');

                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: dbSubscription.user.email,
                    subject: 'Your subscription has been cancelled',
                    html: `<p>Your subscription will remain active until ${periodEnd}.</p>`
                });
            } else {
                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: dbSubscription.user.email,
                    subject: 'Your subscription has been reactivated',
                    html: `<p>Your subscription has been successfully reactivated and will continue to renew automatically.</p>`
                });
            }
            break;
        }
    }
    res.json({ received: true });
};