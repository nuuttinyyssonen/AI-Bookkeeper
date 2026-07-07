import request from "supertest";
import app from "../../app";
import createUser from "../helpers/createUser";
import { prisma } from "../../lib/prisma";
import { supabaseAdmin } from "../../lib/supabase";
import redis from "../../lib/redis";
import { stripe } from "../../services/stripe.service";

jest.mock("../../services/stripe.service", () => ({
    stripe: {
        webhooks: {
            constructEvent: jest.fn()
        },
        subscriptions: {
            retrieve: jest.fn()
        }
    }
}));

const mockConstructEvent = stripe.webhooks.constructEvent as jest.Mock;
const mockRetrieve = stripe.subscriptions.retrieve as jest.Mock;

describe('Subscription webhook route', () => {
    let email: string;
    let user_id: string;
    let business_id: string;
    const stripe_subscription_id = "sub_mock_webhook_1";

    beforeAll(async () => {
        await redis.flushdb();
        email = `integration.webhook.test${Date.now()}@admin.com`;
        business_id = "1111111-13";
        const user = await createUser(email, business_id);
        user_id = user.id;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Returns 400 for an invalid signature', async () => {
        mockConstructEvent.mockImplementation(() => {
            throw new Error("Invalid signature");
        });

        const response = await request(app)
            .post('/api/subscriptions/webhook')
            .set('stripe-signature', 'invalid-signature')
            .send({ type: 'checkout.session.completed' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Webhook signature invalid");
    });

    it('Creates a subscription on checkout.session.completed', async () => {
        mockConstructEvent.mockReturnValue({
            type: 'checkout.session.completed',
            data: {
                object: {
                    customer: 'cus_mock_webhook_1',
                    subscription: stripe_subscription_id,
                    metadata: { subscriptionType: 'BASIC', user_id }
                }
            }
        });

        mockRetrieve.mockResolvedValue({
            id: stripe_subscription_id,
            items: {
                data: [{
                    price: { id: 'price_mock_basic' },
                    current_period_start: 1735689600,
                    current_period_end: 1738368000
                }]
            }
        });

        const response = await request(app)
            .post('/api/subscriptions/webhook')
            .set('stripe-signature', 'mock-signature')
            .send({ type: 'checkout.session.completed' });

        expect(response.status).toBe(200);
        expect(response.body.received).toBe(true);

        const subscription = await prisma.subscription.findUnique({ where: { user_id } });
        expect(subscription?.stripe_subscription_id).toBe(stripe_subscription_id);
        expect(subscription?.stripe_price_id).toBe('price_mock_basic');
        expect(subscription?.subscription_status).toBe('ACTIVE');
        expect(subscription?.current_period_start).toEqual(new Date(1735689600 * 1000));
        expect(subscription?.current_period_end).toEqual(new Date(1738368000 * 1000));
    });

    it('Updates the billing period on invoice.payment_succeeded', async () => {
        mockConstructEvent.mockReturnValue({
            type: 'invoice.payment_succeeded',
            data: {
                object: {
                    subscription: stripe_subscription_id
                }
            }
        });

        mockRetrieve.mockResolvedValue({
            id: stripe_subscription_id,
            items: {
                data: [{
                    current_period_start: 1738368000,
                    current_period_end: 1741046400
                }]
            }
        });

        const response = await request(app)
            .post('/api/subscriptions/webhook')
            .set('stripe-signature', 'mock-signature')
            .send({ type: 'invoice.payment_succeeded' });

        expect(response.status).toBe(200);
        expect(response.body.received).toBe(true);

        const subscription = await prisma.subscription.findUnique({ where: { user_id } });
        expect(subscription?.subscription_status).toBe('ACTIVE');
        expect(subscription?.current_period_start).toEqual(new Date(1738368000 * 1000));
        expect(subscription?.current_period_end).toEqual(new Date(1741046400 * 1000));
    });

    it('Sends a cancellation email on customer.subscription.updated with cancel_at_period_end true', async () => {
        mockConstructEvent.mockReturnValue({
            type: 'customer.subscription.updated',
            data: {
                object: {
                    id: stripe_subscription_id,
                    cancel_at_period_end: true
                }
            }
        });

        const response = await request(app)
            .post('/api/subscriptions/webhook')
            .set('stripe-signature', 'mock-signature')
            .send({ type: 'customer.subscription.updated' });

        expect(response.status).toBe(200);
        expect(response.body.received).toBe(true);

        const subscription = await prisma.subscription.findUnique({ where: { user_id } });
        expect(subscription?.cancel_at_period_end).toBe(true);
    });

    it('Sends a reactivation email on customer.subscription.updated with cancel_at_period_end false', async () => {
        mockConstructEvent.mockReturnValue({
            type: 'customer.subscription.updated',
            data: {
                object: {
                    id: stripe_subscription_id,
                    cancel_at_period_end: false
                }
            }
        });

        const response = await request(app)
            .post('/api/subscriptions/webhook')
            .set('stripe-signature', 'mock-signature')
            .send({ type: 'customer.subscription.updated' });

        expect(response.status).toBe(200);
        expect(response.body.received).toBe(true);

        const subscription = await prisma.subscription.findUnique({ where: { user_id } });
        expect(subscription?.cancel_at_period_end).toBe(false);
    });

    it('Marks the subscription as cancelled on customer.subscription.deleted', async () => {
        mockConstructEvent.mockReturnValue({
            type: 'customer.subscription.deleted',
            data: {
                object: {
                    id: stripe_subscription_id
                }
            }
        });

        const response = await request(app)
            .post('/api/subscriptions/webhook')
            .set('stripe-signature', 'mock-signature')
            .send({ type: 'customer.subscription.deleted' });

        expect(response.status).toBe(200);
        expect(response.body.received).toBe(true);

        const subscription = await prisma.subscription.findUnique({ where: { user_id } });
        expect(subscription?.subscription_status).toBe('CANCELLED');
        expect(subscription?.ended_at).not.toBeNull();
    });

    afterAll(async () => {
        if (!user_id) return;

        await prisma.subscription.deleteMany({ where: { user_id } });

        const user = await prisma.user.findUnique({ where: { id: user_id } });
        if (user?.supabase_id) {
            await supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }

        await prisma.user.delete({ where: { id: user_id } }).catch(() => {});
    });
});
