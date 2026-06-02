import request from "supertest";
import app from "../../app";
import { prisma } from "../../lib/prisma";
import createUser from "../helpers/createUser";
import { supabaseAdmin } from "../../lib/supabase";

describe('Login routes', () => {
    let user_id: any;
    let email: string;

    beforeAll(async () => {
        email = `integration.login.test${Date.now()}@admin.com`;
        const user = await createUser(email);
        user_id = user.id;
    });

    it('Logs in with valid data', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: email, password: "123456" })
        expect(response.status).toBe(200);
        expect(response.body.user.token).toBeDefined();
        expect(typeof response.body.user.token).toBe('string');
        expect(response.body.user.token.length).toBeGreaterThan(0);
    });

    it("Fails with unvalid password", async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: email, password: "12345678" })
        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Password or email is not correct");
    });

    it("Fails with unvalid email", async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: "integration.login.test123@admin.com", password: "123456" })
        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Password or email is not correct");
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
