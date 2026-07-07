import request from "supertest";
import { prisma } from "../../lib/prisma";
import app from "../../app";
import createUser from "../helpers/createUser";
import createReceipt from "../helpers/createReceipt";
import path from 'path';
import { supabaseAdmin } from "../../lib/supabase";
import redis from "../../lib/redis";

jest.mock("../../queues/queue", () => ({
    receiptQueue: {
        add: jest.fn().mockResolvedValue({ id: "mock-job-1" })
    }
}));

jest.mock("../../middleware/subscription", () => ({
    requireSubscription: jest.fn((req, res, next) => next())
}));

describe('Receipt routes', () => {
    let user_id: string;
    let document_id: string;
    let receipt_id: string;
    let business_id: string;

    let email: string;
    let fileName: string;
    let token: string;

    let receipt_vats: Array<{
        id: string;
        receipt_id: string;
        rate: number;
        net_amount: number;
        vat_amount: number;
        total: number;
    }>;

    beforeAll(async () => {
        await redis.flushdb();
        email = `integration.receipt.test${Date.now()}@admin.com`;
        business_id = "1111111-7";
        const user = await createUser(email, business_id);
        user_id = user.id;

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;

        const storageResponse = await request(app)
            .post("/api/storage/")
            .set('Cookie', `token=${token}`)
            .attach("files", path.join(__dirname, "../fixtures/test.jpg"))
        document_id = storageResponse.body[0].id;
        fileName = storageResponse.body[0].document_name;
        
        const receipt = await createReceipt(document_id, user_id);
        receipt_id = receipt.id;

        await prisma.category.upsert({
            where: { type: "PANKKIKULUT" },
            update: {},
            create: { type: "PANKKIKULUT", label: "Pankkikulut" },
        });

    }, 10000);

    it('Gets all receipts by user id', async () => {
        const response = await request(app)
            .get(`/api/receipt`)
            .set('Cookie', `token=${token}`)
        expect(response.status).toBe(200);
    });

    it('Gets one receipt by Id', async () => {
        const response = await request(app)
            .get(`/api/receipt/${receipt_id}`)
            .set('Cookie', `token=${token}`)
        expect(response.status).toBe(200);
        receipt_vats = response.body.receipt.receiptVats
    });

    it('Updates receipt successfully', async () => {
        const vendor_name = "test_vendor";
        const total_amount = 1000;
        const receipt_date = new Date();

        const respone = await request(app)
            .put(`/api/receipt/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({
                vendor_name, total_amount, receipt_date, receipt_vats
            });
        
        expect(respone.status).toBe(200);

        const receipt = await prisma.receipt.findUnique({ where: { id: receipt_id } });
        expect(receipt?.vendor_name).toBe(vendor_name);
        expect(receipt?.receipt_date).toStrictEqual(receipt_date);
        expect(receipt?.total_amount).toBe(total_amount);
    });

    it('Updates receipt category successfully', async () => {
        const respone = await request(app)
            .put(`/api/receipt/category/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({
                category: "PANKKIKULUT"
            });
        
        expect(respone.status).toBe(200);

        const category = await prisma.category.findUnique({ where: { type: "PANKKIKULUT" } });
        const receipt = await prisma.receipt.findUnique({ where: { id: receipt_id } });
        expect(receipt?.category_id).toBe(category?.id);
    });

    it('Updates receipt deductibility percentage successfully', async () => {
        const deductibilityPercentage = 50.0
        const respone = await request(app)
            .put(`/api/receipt/percentage/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({
                deductibilityPercentage: deductibilityPercentage
            });
        
        expect(respone.status).toBe(200);

        const receipt = await prisma.receipt.findUnique({ where: { id: receipt_id } });
        expect(Number(receipt?.vat_deductibility_percentage)).toBe(deductibilityPercentage);
    });

    it('Updates receipt deductibility (boolean) successfully', async () => {
        const respone = await request(app)
            .put(`/api/receipt/is_deductible/${receipt_id}`)
            .set('Cookie', `token=${token}`)
            .send({
                isDeductible: false
            });
        
        expect(respone.status).toBe(200);

        const receipt = await prisma.receipt.findUnique({ where: { id: receipt_id } });
        expect(receipt?.is_deductible).toBe(false);
    });

    it('Returns 401 if user is not authenticated', async () => {
        await request(app)
            .post('/api/auth/logout')
            .set('Cookie', `token=${token}`)
        
        const response = await request(app)
            .get('/api/receipt')
            .set('Cookie', `token=${token}`)
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is invalid or expired");
    });

    afterAll(async () => {
        const user = await prisma.user.findUnique({ where: { email: email } });
        const receiptVats = await prisma.receiptVat.findMany({ where: { receipt_id: receipt_id } });

        if(receiptVats) {
            await prisma.receiptVat.deleteMany({
                where: { receipt_id: receipt_id }
            });
        }

        if (receipt_id) {
            await prisma.receipt.delete({
                where: { id: receipt_id }
            });
        }
        
        if (fileName) {
            await supabaseAdmin.storage
                .from("Bookkeeper-FileSystem")
                .remove([fileName]);
        }

        if (user_id) {
            await prisma.document.deleteMany({
                where: { user_id }
            });
        }
        
        if (user?.supabase_id) {
            await supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }

        if (user_id) {
            await prisma.user.delete({ where: { id: user_id } });
        }
    }, 10000);
});