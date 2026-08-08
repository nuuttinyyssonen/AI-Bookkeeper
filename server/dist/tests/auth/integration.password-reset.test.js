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
describe('Password reset routes', () => {
    let email;
    let user_id;
    let business_id;
    let reset_token_id;
    beforeAll(async () => {
        await redis_1.default.flushdb();
        email = `integration.password-reset.test${Date.now()}@admin.com`;
        business_id = "2222222-5";
        const user = await (0, createUser_1.default)(email, business_id);
        user_id = user.id;
    });
    it('Sends a password reset link for a valid email', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/reset-password/send-email')
            .send({ email });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Password reset link has been sent to your email");
        const token = await prisma_1.prisma.passwordResetToken.findFirst({ where: { user_id } });
        expect(token).not.toBeNull();
        reset_token_id = token.id;
    });
    it('Fails with an invalid email format', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/reset-password/send-email')
            .send({ email: "not-an-email" });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid email");
    });
    it('Fails when the email is not found', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/reset-password/send-email')
            .send({ email: "no-such-user@admin.com" });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Email not found");
    });
    it('Fails to reset with a non-uuid token id', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/reset-password/not-a-uuid')
            .send({ password: "newpassword" });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });
    it('Fails to reset with a non-existent token', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/reset-password/00000000-0000-0000-0000-000000000000')
            .send({ password: "newpassword" });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Invalid or expired reset link");
    });
    it('Fails to reset with a password that is too long', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post(`/api/auth/reset-password/${reset_token_id}`)
            .send({ password: "a".repeat(41) });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Password must be at least 40 characters");
    });
    it('Fails to reset with an expired token', async () => {
        const expiredToken = await prisma_1.prisma.passwordResetToken.create({
            data: {
                user_id,
                expires_at: new Date(Date.now() - 60 * 1000)
            }
        });
        const response = await (0, supertest_1.default)(app_1.default)
            .post(`/api/auth/reset-password/${expiredToken.id}`)
            .send({ password: "newpassword" });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Reset link has expired");
        const deletedToken = await prisma_1.prisma.passwordResetToken.findUnique({ where: { id: expiredToken.id } });
        expect(deletedToken).toBeNull();
    });
    it('Resets the password successfully with a valid token', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post(`/api/auth/reset-password/${reset_token_id}`)
            .send({ password: "newpassword" });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Password has been updated");
        const token = await prisma_1.prisma.passwordResetToken.findUnique({ where: { id: reset_token_id } });
        expect(token).toBeNull();
        const loginResponse = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email, password: "newpassword" });
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.user.token).toBeDefined();
    });
    it('Fails to reuse an already used reset token', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post(`/api/auth/reset-password/${reset_token_id}`)
            .send({ password: "anotherpassword" });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Invalid or expired reset link");
    });
    afterAll(async () => {
        if (!user_id)
            return;
        await prisma_1.prisma.passwordResetToken.deleteMany({ where: { user_id } });
        const user = await prisma_1.prisma.user.findUnique({ where: { id: user_id } });
        if (user?.supabase_id) {
            await supabase_1.supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }
        await prisma_1.prisma.user.delete({ where: { id: user_id } }).catch(() => { });
    });
});
