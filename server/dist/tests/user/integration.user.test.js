"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const createUser_1 = __importDefault(require("../helpers/createUser"));
const prisma_1 = require("../../lib/prisma");
const supabase_1 = require("../../lib/supabase");
const redis_1 = __importDefault(require("../../lib/redis"));
const stripe_service_1 = require("../../services/stripe.service");
jest.mock("../../services/stripe.service", () => ({
    stripe: {
        invoices: { list: jest.fn() },
        subscriptions: { cancel: jest.fn().mockResolvedValue({}) }
    }
}));
jest.mock("../../services/supabase.service", () => ({
    deleteFileFromSupabase: jest.fn().mockResolvedValue(undefined)
}));
describe('user data route', () => {
    let token;
    let email;
    let user_id;
    let business_id;
    beforeAll(async () => {
        await redis_1.default.flushdb();
        email = `integration.user.test${Date.now()}@admin.com`;
        business_id = "2222222-1";
        const user = await (0, createUser_1.default)(email, business_id);
        user_id = user.id;
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
    });
    it('Gets user data without a subscription', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/user')
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe(email);
        expect(response.body.subscription).toBeNull();
        expect(response.body.history).toEqual([]);
    });
    it('Updates user data with valid data', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .put('/api/user')
            .set('Cookie', `token=${token}`)
            .send({
            first_name: "updated",
            last_name: "user",
            email: email,
            phonenumber: "0409999999",
            business_id: business_id
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User data updated successfully");
        const updatedUser = await prisma_1.prisma.user.findUnique({ where: { id: user_id } });
        expect(updatedUser?.first_name).toBe("updated");
        expect(updatedUser?.phonenumber).toBe("0409999999");
    });
    it('Fails to update with an email already taken by another user', async () => {
        const otherEmail = `integration.user.test.other${Date.now()}@admin.com`;
        const otherUser = await (0, createUser_1.default)(otherEmail, "2222222-2");
        const response = await (0, supertest_1.default)(app_1.default)
            .put('/api/user')
            .set('Cookie', `token=${token}`)
            .send({
            first_name: "updated",
            last_name: "user",
            email: otherEmail,
            phonenumber: "0409999999",
            business_id: business_id
        });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe("This email is already taken");
        await prisma_1.prisma.user.delete({ where: { id: otherUser.id } });
        if (otherUser.supabase_id) {
            await supabase_1.supabaseAdmin.auth.admin.deleteUser(otherUser.supabase_id);
        }
    });
    it('Updates user data with a brand new, unused email', async () => {
        const newEmail = `integration.user.newemail.test${Date.now()}@admin.com`;
        const response = await (0, supertest_1.default)(app_1.default)
            .put('/api/user')
            .set('Cookie', `token=${token}`)
            .send({
            first_name: "updated",
            last_name: "user",
            email: newEmail,
            phonenumber: "0409999999",
            business_id: business_id
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User data updated successfully");
        const updatedUser = await prisma_1.prisma.user.findUnique({ where: { id: user_id } });
        expect(updatedUser?.email).toBe(newEmail);
    });
    it('Returns 404 when user has no subscription', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/user/subscription')
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Subscription not found");
    });
    describe('with a subscription', () => {
        const stripe_subscription_id = "sub_userdata_1";
        beforeAll(async () => {
            await prisma_1.prisma.subscription.create({
                data: {
                    user_id,
                    subscription_type: "BASIC",
                    subscription_status: "ACTIVE",
                    stripe_subscription_id,
                    stripe_customer_id: "cus_userdata_1",
                    stripe_price_id: process.env.STRIPE_BASIC_PRICE_ID
                }
            });
        });
        it('Gets user data with billing history', async () => {
            stripe_service_1.stripe.invoices.list.mockResolvedValue({
                data: [
                    {
                        id: "in_free",
                        amount_paid: 0,
                        created: 1700000000,
                        status: "paid",
                        invoice_pdf: "https://example.com/free.pdf",
                        lines: { data: [{ amount: 0, pricing: { price_details: { price: process.env.STRIPE_BASIC_PRICE_ID } } }] }
                    },
                    {
                        id: "in_basic",
                        amount_paid: 2900,
                        created: 1700000000,
                        status: "paid",
                        invoice_pdf: "https://example.com/basic.pdf",
                        lines: { data: [{ amount: 2900, pricing: { price_details: { price: process.env.STRIPE_BASIC_PRICE_ID } } }] }
                    },
                    {
                        id: "in_premium",
                        amount_paid: 4900,
                        created: 1700000000,
                        status: "paid",
                        invoice_pdf: "https://example.com/premium.pdf",
                        lines: { data: [{ amount: 4900, pricing: { price_details: { price: process.env.STRIPE_PREMIUM_PRICE_ID } } }] }
                    },
                    {
                        id: "in_unknown",
                        amount_paid: 1000,
                        created: 1700000000,
                        status: "paid",
                        invoice_pdf: "https://example.com/unknown.pdf",
                        lines: { data: [{ amount: -100, pricing: { price_details: { price: "price_unknown" } } }] }
                    }
                ]
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/user')
                .set('Cookie', `token=${token}`);
            expect(response.status).toBe(200);
            expect(response.body.subscription.stripe_subscription_id).toBe(stripe_subscription_id);
            expect(response.body.history).toHaveLength(3);
            const [basic, premium, unknown] = response.body.history;
            expect(basic.description).toBe("Basic — monthly");
            expect(basic.amount).toBe("€29.00");
            expect(premium.description).toBe("Premium — monthly");
            expect(premium.amount).toBe("€49.00");
            expect(unknown.description).toBe("Subscription");
            expect(unknown.amount).toBe("€10.00");
        });
        it('Returns the subscription when one exists', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/user/subscription')
                .set('Cookie', `token=${token}`);
            expect(response.status).toBe(200);
            expect(response.body.subscription.stripe_subscription_id).toBe(stripe_subscription_id);
        });
        afterAll(async () => {
            await prisma_1.prisma.subscription.deleteMany({ where: { user_id } });
        });
    });
    it('Returns 401 if no token in request', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/user');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is missing");
    });
    it('Returns 401 if token is invalid', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/user')
            .set('Cookie', `token=$1239218390213i90wiqdkasdnl`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is invalid or expired");
    });
    afterAll(async () => {
        if (!user_id)
            return;
        const user = await prisma_1.prisma.user.findUnique({ where: { id: user_id } });
        if (user?.supabase_id) {
            await supabase_1.supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }
        if (user_id) {
            await prisma_1.prisma.user.delete({ where: { id: user_id } }).catch(() => { });
        }
    });
});
describe('delete user route', () => {
    let token;
    let email;
    let user_id;
    beforeAll(async () => {
        email = `integration.user.delete.test${Date.now()}@admin.com`;
        const user = await (0, createUser_1.default)(email, "2222222-8");
        user_id = user.id;
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
    });
    it('Returns 401 if no token in request', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .delete('/api/user');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is missing");
    });
    it('Deletes the user successfully', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .delete('/api/user')
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Your account was deleted successfully");
        const deletedUser = await prisma_1.prisma.user.findUnique({ where: { id: user_id } });
        expect(deletedUser).toBeNull();
    });
    afterAll(async () => {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: user_id } });
        if (user?.supabase_id) {
            await supabase_1.supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }
        if (user) {
            await prisma_1.prisma.user.delete({ where: { id: user_id } }).catch(() => { });
        }
    });
});
describe('delete user route with dependencies', () => {
    let token;
    let email;
    let user_id;
    beforeAll(async () => {
        email = `integration.user.delete.deps.test${Date.now()}@admin.com`;
        const user = await (0, createUser_1.default)(email, "2222222-9");
        user_id = user.id;
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
        await prisma_1.prisma.subscription.create({
            data: {
                user_id,
                subscription_type: "BASIC",
                subscription_status: "ACTIVE",
                stripe_subscription_id: "sub_del_deps_1",
                stripe_customer_id: "cus_del_deps_1",
                stripe_price_id: "price_del_deps_1"
            }
        });
        await prisma_1.prisma.document.create({
            data: {
                document_name: `del-deps-doc-${Date.now()}`,
                document_type: "image/jpeg",
                document_size: 100,
                file_path: "dummy/path",
                user_id
            }
        });
        const chatRoom = await prisma_1.prisma.chatRoom.create({ data: { user_id } });
        await prisma_1.prisma.chatMessage.create({
            data: { chatroom_id: chatRoom.id, content: "hello", role: "USER" }
        });
    });
    it('Deletes the user along with their subscription, documents and chat rooms', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .delete('/api/user')
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Your account was deleted successfully");
        expect(await prisma_1.prisma.user.findUnique({ where: { id: user_id } })).toBeNull();
        expect(await prisma_1.prisma.subscription.findFirst({ where: { user_id } })).toBeNull();
        expect(await prisma_1.prisma.document.findMany({ where: { user_id } })).toHaveLength(0);
        expect(await prisma_1.prisma.chatRoom.findMany({ where: { user_id } })).toHaveLength(0);
    });
    afterAll(async () => {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: user_id } });
        if (user?.supabase_id) {
            await supabase_1.supabaseAdmin.auth.admin.deleteUser(user.supabase_id).catch(() => { });
        }
        if (user) {
            await prisma_1.prisma.user.delete({ where: { id: user_id } }).catch(() => { });
        }
    });
});
