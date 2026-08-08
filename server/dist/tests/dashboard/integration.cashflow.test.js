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
describe('dashboard data route', () => {
    let token;
    let email;
    let user_id;
    let business_id;
    beforeAll(async () => {
        await redis_1.default.flushdb();
        email = `integration.cashflow.test${Date.now()}@admin.com`;
        business_id = "1111111-4";
        const user = await (0, createUser_1.default)(email, business_id);
        user_id = user.id;
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
    });
    it('returns cashflow for 6 month period', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/dashboard/cashflow')
            .set('Cookie', `token=${token}`);
        const expectedMonths = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setDate(1);
            date.setMonth(date.getMonth() - i);
            return {
                month: date.toLocaleString("fi-FI", { month: "short" }),
                income: 0,
                expense: 0
            };
        }).reverse();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            cashflow: expectedMonths
        });
    });
    it('returns 401 if no token in request', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/dashboard/cashflow');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is missing");
    });
    it('returns 401 if token is invalid', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/dashboard/cashflow')
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
            await prisma_1.prisma.user.delete({ where: { id: user_id } });
        }
    });
});
