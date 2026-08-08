"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const supabase_1 = require("../../lib/supabase");
const redis_1 = __importDefault(require("../../lib/redis"));
describe('Signup route', () => {
    let email = "integration.auth.test.ts@admin.com";
    let password = "123456";
    let firstName = "test";
    let lastName = "integration";
    let phonenumber = "040123456";
    let business_id = "1111111-3";
    beforeAll(async () => {
        await redis_1.default.flushdb();
    });
    it('Works with valid data', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/signup')
            .send({
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName,
            phonenumber: phonenumber,
            business_id: business_id
        });
        expect(response.status).toBe(201);
        expect(response.body.email).toBe(email);
    });
    it('Fails with ununique email', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/signup')
            .send({
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName,
            phonenumber: phonenumber,
            business_id: business_id
        });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Email is already in use");
    });
    it('Fails with too short password', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/signup')
            .send({
            email: email,
            password: "123",
            first_name: firstName,
            last_name: lastName,
            phonenumber: phonenumber,
            business_id: business_id
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Password must be at least 5 characters");
    });
    it('Fails if not all fields are used', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/signup')
            .send({
            email: "integration.auth2.test.ts@admin.com",
            password: password,
            first_name: firstName,
            last_name: lastName,
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid input: expected string, received undefined");
    });
    afterAll(async () => {
        const user = await prisma_1.prisma.user.findUnique({ where: { email: email } });
        if (user?.supabase_id) {
            await supabase_1.supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }
        await prisma_1.prisma.user.delete({ where: { email: email } });
    });
});
