"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const prisma_1 = require("../../lib/prisma");
const app_1 = __importDefault(require("../../app"));
const createUser_1 = __importDefault(require("../helpers/createUser"));
const createReceipt_1 = __importDefault(require("../helpers/createReceipt"));
const path_1 = __importDefault(require("path"));
const supabase_1 = require("../../lib/supabase");
const redis_1 = __importDefault(require("../../lib/redis"));
jest.mock("../../queues/queue", () => ({
    receiptQueue: {
        add: jest.fn().mockResolvedValue({ id: "mock-job-1" })
    }
}));
jest.mock("../../middleware/subscription", () => ({
    requireSubscription: jest.fn((req, res, next) => next())
}));
describe('Receipt routes', () => {
    let user_id;
    let document_id;
    let receipt_id;
    let business_id;
    let batch_id;
    let email;
    let fileName;
    let token;
    let receipt_vats;
    beforeAll(async () => {
        await redis_1.default.flushdb();
        email = `integration.receipt.test${Date.now()}@admin.com`;
        business_id = "1111111-7";
        const user = await (0, createUser_1.default)(email, business_id);
        user_id = user.id;
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
        const storageResponse = await (0, supertest_1.default)(app_1.default)
            .post("/api/storage/")
            .set('Cookie', `token=${token}`)
            .attach("files", path_1.default.join(__dirname, "../fixtures/test.jpg"));
        document_id = storageResponse.body[0].id;
        fileName = storageResponse.body[0].document_name;
        batch_id = storageResponse.body[0].upload_batch_id;
        const receipt = await (0, createReceipt_1.default)(document_id, user_id);
        receipt_id = receipt.id;
        await prisma_1.prisma.category.upsert({
            where: { type: "PANKKIKULUT" },
            update: {},
            create: { type: "PANKKIKULUT", label: "Pankkikulut" },
        });
    }, 10000);
    it('Gets all receipts by user id', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt`)
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.is_documents_pending).toBe(true);
        expect(response.body.is_documents_processing).toBe(false);
    });
    it('Fails to get receipts with an invalid query parameter', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt`)
            .query({ limit: 999 })
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(400);
    });
    it('Filters receipts by type', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt`)
            .query({ type: "EXPENSE" })
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.total).toBeGreaterThanOrEqual(1);
    });
    it('Filters receipts by search term', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt`)
            .query({ search: "test vendor" })
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.total).toBeGreaterThanOrEqual(1);
    });
    it('Filters receipts by a from date', async () => {
        const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt`)
            .query({ from })
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.total).toBeGreaterThanOrEqual(1);
    });
    it('Filters receipts by a to date', async () => {
        const to = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt`)
            .query({ to })
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.total).toBeGreaterThanOrEqual(1);
    });
    it('Gets one receipt by Id', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt/${receipt_id}`)
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        receipt_vats = response.body.receipt.receiptVats;
    });
    it('Fails to get a receipt with an invalid id format', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt/not-a-uuid`)
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });
    it('Returns 404 for a receipt that does not exist', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt/00000000-0000-0000-0000-000000000000`)
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Resource not found");
    });
    it('Fails to get receipt status with an invalid batch id', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt/status/not-a-uuid`)
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid Batch ID format");
    });
    it('Gets receipt status for a batch id', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt/status/${batch_id}`)
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            pending_documents: 1,
            completed_documents: 0,
            processing_documents: 0,
            total: 1
        });
    });
    it('Fails to export receipts with an invalid query parameter', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt/create/excel`)
            .query({ type: "INVALID" })
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(400);
    });
    it('Exports receipts to excel', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt/create/excel`)
            .set('Cookie', `token=${token}`)
            .buffer(true)
            .parse((res, callback) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => callback(null, Buffer.concat(chunks)));
        });
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        expect(response.headers['content-disposition']).toContain('receipts-all-');
        // xlsx files are zip archives, which start with the 'PK' magic bytes
        expect(response.body.slice(0, 2).toString()).toBe('PK');
    });
    it('Exports receipts to excel filtered by type', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt/create/excel`)
            .query({ type: "EXPENSE" })
            .set('Cookie', `token=${token}`)
            .buffer(true)
            .parse((res, callback) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => callback(null, Buffer.concat(chunks)));
        });
        expect(response.status).toBe(200);
        expect(response.headers['content-disposition']).toContain('receipts-expense-');
    });
    it('Fails to update a receipt with an invalid id', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/not-a-uuid`)
            .set('Cookie', `token=${token}`)
            .send({ vendor_name: "test", total_amount: 100, receipt_date: new Date() });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });
    it('Fails to update a receipt with invalid data', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({ vendor_name: "", total_amount: 100, receipt_date: new Date() });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Vendor name is required");
    });
    it('Updates a receipt without vats', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({ vendor_name: "no vats vendor", total_amount: 500, receipt_date: new Date() });
        expect(response.status).toBe(200);
        const receipt = await prisma_1.prisma.receipt.findUnique({ where: { id: receipt_id } });
        expect(receipt?.vendor_name).toBe("no vats vendor");
    });
    it('Updates receipt successfully', async () => {
        const vendor_name = "test_vendor";
        const total_amount = 1000;
        const receipt_date = new Date();
        const respone = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({
            vendor_name, total_amount, receipt_date, receipt_vats
        });
        expect(respone.status).toBe(200);
        const receipt = await prisma_1.prisma.receipt.findUnique({ where: { id: receipt_id } });
        expect(receipt?.vendor_name).toBe(vendor_name);
        expect(receipt?.receipt_date).toStrictEqual(receipt_date);
        expect(receipt?.total_amount).toBe(total_amount);
    });
    it('Fails to update category with an invalid category value', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/category/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({ category: "ab" });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid category");
    });
    it('Fails to update category with an invalid id', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/category/not-a-uuid`)
            .set('Cookie', `token=${token}`)
            .send({ category: "PANKKIKULUT" });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });
    it('Updates receipt category successfully', async () => {
        const respone = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/category/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({
            category: "PANKKIKULUT"
        });
        expect(respone.status).toBe(200);
        const category = await prisma_1.prisma.category.findUnique({ where: { type: "PANKKIKULUT" } });
        const receipt = await prisma_1.prisma.receipt.findUnique({ where: { id: receipt_id } });
        expect(receipt?.category_id).toBe(category?.id);
    });
    it('Filters receipts by category', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/receipt`)
            .query({ category: "PANKKIKULUT" })
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.total).toBeGreaterThanOrEqual(1);
    });
    it('Fails to update deductibility percentage above 100', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/percentage/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({ deductibilityPercentage: 150 });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Percentage must be 100 or lower");
    });
    it('Fails to update deductibility percentage below 0', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/percentage/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({ deductibilityPercentage: -5 });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Percentage must be at least 0");
    });
    it('Fails to update deductibility percentage with an invalid id', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/percentage/not-a-uuid`)
            .set('Cookie', `token=${token}`)
            .send({ deductibilityPercentage: 50 });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });
    it('Updates receipt deductibility percentage successfully', async () => {
        const deductibilityPercentage = 50.0;
        const respone = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/percentage/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({
            deductibilityPercentage: deductibilityPercentage
        });
        expect(respone.status).toBe(200);
        const receipt = await prisma_1.prisma.receipt.findUnique({ where: { id: receipt_id } });
        expect(Number(receipt?.vat_deductibility_percentage)).toBe(deductibilityPercentage);
    });
    it('Fails to update is_deductible with a non-boolean value', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/is_deductible/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({ isDeductible: "yes" });
        expect(response.status).toBe(400);
    });
    it('Fails to update is_deductible with an invalid id', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/is_deductible/not-a-uuid`)
            .set('Cookie', `token=${token}`)
            .send({ isDeductible: false });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });
    it('Updates receipt deductibility (boolean) successfully', async () => {
        const respone = await (0, supertest_1.default)(app_1.default)
            .put(`/api/receipt/is_deductible/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({
            isDeductible: false
        });
        expect(respone.status).toBe(200);
        const receipt = await prisma_1.prisma.receipt.findUnique({ where: { id: receipt_id } });
        expect(receipt?.is_deductible).toBe(false);
    });
    it('Returns 401 if user is not authenticated', async () => {
        await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/logout')
            .set('Cookie', `token=${token}`);
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/receipt')
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is invalid or expired");
    });
    afterAll(async () => {
        const user = await prisma_1.prisma.user.findUnique({ where: { email: email } });
        const receiptVats = await prisma_1.prisma.receiptVat.findMany({ where: { receipt_id: receipt_id } });
        if (receiptVats) {
            await prisma_1.prisma.receiptVat.deleteMany({
                where: { receipt_id: receipt_id }
            });
        }
        if (receipt_id) {
            await prisma_1.prisma.receipt.delete({
                where: { id: receipt_id }
            });
        }
        if (fileName) {
            await supabase_1.supabaseAdmin.storage
                .from("Bookkeeper-FileSystem")
                .remove([fileName]);
        }
        if (user_id) {
            await prisma_1.prisma.document.deleteMany({
                where: { user_id }
            });
        }
        if (user?.supabase_id) {
            await supabase_1.supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }
        if (user_id) {
            await prisma_1.prisma.user.delete({ where: { id: user_id } });
        }
    }, 10000);
});
