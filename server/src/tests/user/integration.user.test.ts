import request from "supertest";
import app from "../../app";
import createUser from "../helpers/createUser";
import { prisma } from "../../lib/prisma";
import { supabaseAdmin } from "../../lib/supabase";
import redis from "../../lib/redis";

describe('user data route', () => {
    let token: string;
    let email: string;
    let user_id: string;
    let business_id: string;

    beforeAll(async () => {
        await redis.flushdb();
        email = `integration.user.test${Date.now()}@admin.com`;
        business_id = "2222222-1";
        const user = await createUser(email, business_id);
        user_id = user.id;
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
    });

    it('Gets user data without a subscription', async () => {
        const response = await request(app)
            .get('/api/user')
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe(email);
        expect(response.body.subscription).toBeNull();
        expect(response.body.history).toEqual([]);
    });

    it('Updates user data with valid data', async () => {
        const response = await request(app)
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

        const updatedUser = await prisma.user.findUnique({ where: { id: user_id } });
        expect(updatedUser?.first_name).toBe("updated");
        expect(updatedUser?.phonenumber).toBe("0409999999");
    });

    it('Fails to update with an email already taken by another user', async () => {
        const otherEmail = `integration.user.test.other${Date.now()}@admin.com`;
        const otherUser = await createUser(otherEmail, "2222222-2");

        const response = await request(app)
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

        await prisma.user.delete({ where: { id: otherUser.id } });
        if (otherUser.supabase_id) {
            await supabaseAdmin.auth.admin.deleteUser(otherUser.supabase_id);
        }
    });

    it('Returns 404 when user has no subscription', async () => {
        const response = await request(app)
            .get('/api/user/subscription')
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Subscription not found");
    });

    it('Returns 401 if no token in request', async () => {
        const response = await request(app)
            .get('/api/user');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is missing");
    });

    it('Returns 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/api/user')
            .set('Cookie', `token=$1239218390213i90wiqdkasdnl`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is invalid or expired");
    });

    afterAll(async () => {
        if (!user_id) return;

        const user = await prisma.user.findUnique({ where: { id: user_id } });
        if (user?.supabase_id) {
            await supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }

        if (user_id) {
            await prisma.user.delete({ where: { id: user_id } }).catch(() => {});
        }
    });
});

describe('delete user route', () => {
    let token: string;
    let email: string;
    let user_id: string;

    beforeAll(async () => {
        email = `integration.user.delete.test${Date.now()}@admin.com`;
        const user = await createUser(email, "2222222-3");
        user_id = user.id;
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
    });

    it('Returns 401 if no token in request', async () => {
        const response = await request(app)
            .delete('/api/user');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is missing");
    });

    it('Deletes the user successfully', async () => {
        const response = await request(app)
            .delete('/api/user')
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Your account was deleted successfully");

        const deletedUser = await prisma.user.findUnique({ where: { id: user_id } });
        expect(deletedUser).toBeNull();
    });

    afterAll(async () => {
        const user = await prisma.user.findUnique({ where: { id: user_id } });
        if (user?.supabase_id) {
            await supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }
        if (user) {
            await prisma.user.delete({ where: { id: user_id } }).catch(() => {});
        }
    });
});