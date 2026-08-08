"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const prisma_1 = require("../../lib/prisma");
const createUser_1 = __importDefault(require("../helpers/createUser"));
const supabase_1 = require("../../lib/supabase");
const redis_1 = __importDefault(require("../../lib/redis"));
describe('Login routes', () => {
    let user_id;
    let email;
    let business_id;
    beforeAll(async () => {
        await redis_1.default.flushdb();
        email = `integration.login.test${Date.now()}@admin.com`;
        business_id = "1111111-1";
        const user = await (0, createUser_1.default)(email, business_id);
        user_id = user.id;
    });
    it('Logs in with valid data', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email: email, password: "123456" });
        expect(response.status).toBe(200);
        expect(response.body.user.token).toBeDefined();
        expect(typeof response.body.user.token).toBe('string');
        expect(response.body.user.token.length).toBeGreaterThan(0);
    });
    it("Fails with unvalid password", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email: email, password: "12345678" });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Password or email is not correct");
    });
    it("Fails with unvalid email", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email: "integration.login.test123@admin.com", password: "123456" });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Password or email is not correct");
    });
    afterAll(async () => {
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
