import request from "supertest";
import app from "../../app";
import createUser from "../helpers/createUser";
import { prisma } from "../../lib/prisma";
import { supabaseAdmin } from "../../lib/supabase";

describe('dashboard data route', () => {
    let token: string;
    let email: string;
    let user_id: string;

    beforeAll(async () => {
        email = `integration.cashflow.test${Date.now()}@admin.com`;
        const user = await createUser(email);
        user_id = user.id;
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
    });

    it('returns cashflow for 6 month period', async () => {
        const response = await request(app)
            .get('/api/dashboard/cashflow')
            .set('Cookie', `token=${token}`)
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            cashflow: [
            { month: 'tammi', income: 0, expense: 0 },
            { month: 'helmi', income: 0, expense: 0 },
            { month: 'maalis', income: 0, expense: 0 },
            { month: 'huhti', income: 0, expense: 0 },
            { month: 'touko', income: 0, expense: 0 },
            { month: 'kesä', income: 0, expense: 0 }
            ]
        });
    });

    it('returns 401 if no token in request', async () => {
        const response = await request(app)
            .get('/api/dashboard/cashflow')
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is missing");
    });

    it('returns 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/api/dashboard/cashflow')
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