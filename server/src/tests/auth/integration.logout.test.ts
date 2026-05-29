import request from 'supertest';
import app from '../../app';
import createUser from '../helpers/createUser';
import { prisma } from '../../lib/prisma';
import { supabase } from '../../lib/supabase';

describe("Logout route", () => {
    let token: string;
    let email = "integration.logout.test@admin.com";
    let user_id: number;

    beforeEach(async () => {
        const user = await createUser(email);
        user_id = user.id;

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: email, password: "123456" });
        token = response.body.user.token;
    });

    it('Logs out successfully', async () => {
        const response = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', `token=${token}`)
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Logged out successfully");
    });

    it('Clears token cookie', async () => {
        const response = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', `token=${token}`)

        expect(response.status).toBe(200);

        const setCookie = response.headers['set-cookie'];
        const cookies = Array.isArray(setCookie) ? setCookie.join(';') : setCookie;

        expect(cookies).toBeDefined();
        expect(cookies).toContain('token=');
        expect(cookies).toContain('Expires=Thu, 01 Jan 1970');
    });

    it('Fails to logout if user is not logged in', async () => {
        const response = await request(app)
            .post('/api/auth/logout')
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Not logged in");
    });

    it("Fails to logout if token is invalid", async () => {
        const response = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', `token=invalid-token`)
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Invalid or expired session");
    });

    afterEach(async () => {
        const user = await prisma.user.findUnique({ where: { id: user_id } });
        
        if (user?.supabase_id) {
            await supabase.auth.admin.deleteUser(user.supabase_id);
        }

        await prisma.user.delete({ where: { id: user_id } });
    });
});