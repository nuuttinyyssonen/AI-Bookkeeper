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
describe("Logout route", () => {
    let token;
    let email;
    let user_id;
    let business_id;
    beforeEach(async () => {
        await redis_1.default.flushdb();
        email = `integration.logout.test${Date.now()}@admin.com`;
        business_id = "1111111-2";
        const user = await (0, createUser_1.default)(email, business_id);
        user_id = user.id;
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email: email, password: "123456" });
        token = response.body.user.token;
    });
    it('Logs out successfully', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/logout')
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Logged out successfully");
    });
    it('Clears token cookie', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/logout')
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        const setCookie = response.headers['set-cookie'];
        const cookies = Array.isArray(setCookie) ? setCookie.join(';') : setCookie;
        expect(cookies).toBeDefined();
        expect(cookies).toContain('token=');
        expect(cookies).toContain('Expires=Thu, 01 Jan 1970');
    });
    it('Fails to logout if user is not logged in', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/logout');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Not logged in");
    });
    it("Fails to logout if token is invalid", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/logout')
            .set('Cookie', `token=invalid-token`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid or expired session");
    });
    afterEach(async () => {
        if (!user_id)
            return;
        const user = await prisma_1.prisma.user.findUnique({ where: { id: user_id } });
        if (user?.supabase_id) {
            await supabase_1.supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }
        if (user_id) {
            await prisma_1.prisma.user.delete({ where: { id: user_id } });
        }
    });
});
