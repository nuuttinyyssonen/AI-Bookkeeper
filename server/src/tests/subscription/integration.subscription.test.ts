import request from "supertest";
import app from "../../app";
import createUser from "../helpers/createUser";
import { prisma } from "../../lib/prisma";
import { supabaseAdmin } from "../../lib/supabase";
import redis from "../../lib/redis";

jest.mock("../../services/stripe.service", () => ({
    stripe: {
        checkout: {
            sessions: {
                create: jest.fn().mockResolvedValue({ url: "https://checkout.stripe.com/mock-session" })
            }
        },
        subscriptions: {
            update: jest.fn().mockResolvedValue({}),
            retrieve: jest.fn().mockResolvedValue({ items: { data: [{ id: "si_mock_123" }] } })
        }
    }
}));

describe('Subscription routes', () => {
    let token: string;
    let email: string;
    let user_id: string;
    let business_id: string;

    beforeAll(async () => {
        await redis.flushdb();
        email = `integration.subscription.test${Date.now()}@admin.com`;
        business_id = "2222222-6";
        const user = await createUser(email, business_id);
        user_id = user.id;
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
    });

    it('Creates a checkout session with valid data', async () => {
        const response = await request(app)
            .post('/api/subscription/create-checkout-session')
            .send({ subscriptionType: "BASIC", user_id });

        expect(response.status).toBe(200);
        expect(response.body.url).toBe("https://checkout.stripe.com/mock-session");
    });

    it('Fails to create a checkout session with an invalid user_id', async () => {
        const response = await request(app)
            .post('/api/subscription/create-checkout-session')
            .send({ subscriptionType: "BASIC", user_id: "not-a-uuid" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid user_id format");
    });

    it('Fails to create a checkout session with an invalid subscription type', async () => {
        const response = await request(app)
            .post('/api/subscription/create-checkout-session')
            .send({ subscriptionType: "a".repeat(21), user_id });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid subscription type");
    });

    it('Returns no active subscription message when user has none', async () => {
        const response = await request(app)
            .get('/api/subscription/status')
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("You don't have an active subscription");
    });

    it('Fails to delete a subscription that does not exist', async () => {
        const response = await request(app)
            .delete('/api/subscription/delete')
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Subscription not found");
    });

    it('Fails to change a plan that does not exist', async () => {
        const response = await request(app)
            .put('/api/subscription/change-plan')
            .set('Cookie', `token=${token}`)
            .send({ subscriptionType: "PREMIUM" });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Susbcription not found");
    });

    it('Fails to revoke a plan that does not exist', async () => {
        const response = await request(app)
            .put('/api/subscription/revoke-plan')
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Subscription not found");
    });

    describe('with an existing subscription', () => {
        beforeAll(async () => {
            await prisma.subscription.create({
                data: {
                    user_id,
                    subscription_type: "BASIC",
                    subscription_status: "ACTIVE",
                    stripe_subscription_id: "sub_mock_123",
                    stripe_customer_id: "cus_mock_123",
                    stripe_price_id: "price_mock_basic"
                }
            });
        });

        it('Returns the subscription status', async () => {
            const response = await request(app)
                .get('/api/subscription/status')
                .set('Cookie', `token=${token}`);

            expect(response.status).toBe(200);
            expect(response.body.subscription.stripe_subscription_id).toBe("sub_mock_123");
            expect(response.body.subscription.subscription_type).toBe("BASIC");
        });

        it('Fails to change plan with an invalid subscription type', async () => {
            const response = await request(app)
                .put('/api/subscription/change-plan')
                .set('Cookie', `token=${token}`)
                .send({ subscriptionType: "" });

            expect(response.status).toBe(400);
        });

        it('Changes the subscription plan', async () => {
            const response = await request(app)
                .put('/api/subscription/change-plan')
                .set('Cookie', `token=${token}`)
                .send({ subscriptionType: "PREMIUM" });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Subscription is updated successfully");

            const subscription = await prisma.subscription.findUnique({ where: { user_id } });
            expect(subscription?.subscription_type).toBe("PREMIUM");
        });

        it('Revokes the scheduled cancellation', async () => {
            const response = await request(app)
                .put('/api/subscription/revoke-plan')
                .set('Cookie', `token=${token}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Subscription reactivated");
        });

        it('Deletes (cancels) the subscription', async () => {
            const response = await request(app)
                .delete('/api/subscription/delete')
                .set('Cookie', `token=${token}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Subscription will be cancelled at end of billing period");
        });
    });

    it('Returns 401 if no token in request', async () => {
        const response = await request(app)
            .get('/api/subscription/status');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is missing");
    });

    it('Returns 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/api/subscription/status')
            .set('Cookie', `token=$1239218390213i90wiqdkasdnl`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is invalid or expired");
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
