import request from "supertest";
import app from "../../app";
import createUser from "../helpers/createUser";
import { prisma } from "../../lib/prisma";
import { supabaseAdmin } from "../../lib/supabase";
import redis from "../../lib/redis";

describe('dashboard data route', () => {
    let token: string;
    let email: string;
    let user_id: string;
    let business_id: string;

    beforeAll(async () => {
        await redis.flushdb();
        email = `integration.dashboard.test${Date.now()}@admin.com`;
        business_id = "1111111-5";
        const user = await createUser(email, business_id);
        user_id = user.id;
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
    });

    it('returns expenses, revenue and recent transactions', async () => {
        const response = await request(app)
            .get('/api/dashboard')
            .set('Cookie', `token=${token}`)
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            revenue: { _sum: { total_amount: null } },
            expenses: { _sum: { total_amount: null } },
            net_profit: 0,
            recent_receipts: []
        });
    });

    it('returns 401 if no token in request', async () => {
        const response = await request(app)
            .get('/api/dashboard')
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is missing");
    });

    it('returns 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/api/dashboard')
            .set('Cookie', `token=$1239218390213i90wiqdkasdnl`)
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is invalid or expired");
    });

    afterAll(async () => {
        if(!user_id) return;  

        const user = await prisma.user.findUnique({ where: { id: user_id } });
        if (user?.supabase_id) {
            await supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }

        if (user_id) {
            await prisma.user.delete({ where: { id: user_id } });
        }
    });
});