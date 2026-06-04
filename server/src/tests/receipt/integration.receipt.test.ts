import request from "supertest";
import { prisma } from "../../lib/prisma";
import app from "../../app";
import createUser from "../helpers/createUser";
import createReceipt from "../helpers/createReceipt";
import path from 'path';
import { supabaseAdmin } from "../../lib/supabase";

describe('Receipt routes', () => {
    let user_id: string;
    let document_id: string;
    let receipt_id: string;

    let email: string;
    let fileName: string;
    let token: string;

    beforeAll(async () => {
        email = `integration.receipt.test${Date.now()}@admin.com`;
        const user = await createUser(email);
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

    });

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
    });
});