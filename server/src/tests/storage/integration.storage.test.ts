import { prisma } from "../../lib/prisma";
import request from "supertest";
import createUser from "../helpers/createUser";
import app from "../../app";
import { supabaseAdmin } from "../../lib/supabase";
import path from 'path';
import createReceipt from "../helpers/createReceipt";
import redis from "../../lib/redis";

jest.mock("../../queues/queue", () => ({
    receiptQueue: {
        add: jest.fn().mockResolvedValue({ id: "mock-job-1" })
    }
}));

jest.mock("../../middleware/subscription", () => ({
    requireSubscription: jest.fn((req, res, next) => next())
}));

describe("Storage routes", () => {
    let email: string;
    let user_id: string;
    let document_id: string;
    let fileName: string;
    let token: string;
    let receipt_id: string;
    let business_id: string;
    let second_document_id: string;
    let other_user_id: string;
    let other_receipt_id: string;

    beforeAll(async () => {
        await redis.flushdb();
        email = `integration.storage.test${Date.now()}@admin.com`;
        business_id = "1111111-9";
        const user = await createUser(email, business_id);
        user_id = user.id;

        const response = await request(app)
            .post("/api/auth/login")
            .send({ email, password: "123456" });
        token = response.body.user.token;

        const storageResponse = await request(app)
            .post("/api/storage/")
            .set('Cookie', `token=${token}`)
            .attach("files", path.join(__dirname, "../fixtures/test.jpg"));

        // Fail fast with a useful message instead of cascading undefined errors
        if (!storageResponse.body?.[0]?.id) {
            throw new Error(
                `beforeAll upload failed. Status: ${storageResponse.status}, Body: ${JSON.stringify(storageResponse.body)}`
            );
        }

        document_id = storageResponse.body[0].id;

        const receipt = await createReceipt(document_id, user_id);
        receipt_id = receipt.id;
    }, 10000);

    it("Uploads file successfully", async () => {
        const response = await request(app)
            .post("/api/storage/")
            .set('Cookie', `token=${token}`)
            .attach("files", path.join(__dirname, "../fixtures/test.jpg"))

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toMatchObject({
            user_id,
            document_type: "image/jpeg",
            document_size: 2187095
        });

        fileName = response.body[0].document_name;
        second_document_id = response.body[0].id;
        expect(fileName).toContain("test.jpg");
    });

    it("Fails to upload file if file is too large", async () => {
        const largeBuffer = Buffer.alloc(11 * 1024 * 1024, "a");

        const response = await request(app)
            .post("/api/storage/")
            .set('Cookie', `token=${token}`)
            .attach("files", largeBuffer, {
                filename: "large-file.jpg",
                contentType: "image/jpeg"
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("File too large. Maximum size is 10MB");
    });

    it("Deletes file successfully", async () => {
        const response = await request(app)
            .delete(`/api/storage/${receipt_id}`)
            .set('Cookie', `token=${token}`)
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("File was deleted successfully");
    });

    it("Sets up another user's file for authorization checks", async () => {
        const otherUser = await createUser(`integration.storage.other.test${Date.now()}@admin.com`, "1111111-90");
        other_user_id = otherUser.id;

        const otherDocument = await prisma.document.create({
            data: {
                document_name: `other-user-doc-${Date.now()}`,
                document_type: "image/jpeg",
                document_size: 100,
                file_path: "dummy/path",
                user_id: other_user_id
            }
        });

        const otherReceipt = await createReceipt(otherDocument.id, other_user_id);
        other_receipt_id = otherReceipt.id;
    });

    it("Fails to delete a file with an invalid id", async () => {
        const response = await request(app)
            .delete(`/api/storage/not-a-uuid`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });

    it("Fails to delete another user's file", async () => {
        const response = await request(app)
            .delete(`/api/storage/${other_receipt_id}`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    });

    it("Fails to download a file with an invalid id", async () => {
        const response = await request(app)
            .get(`/api/storage/not-a-uuid`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });

    it("Returns 404 when downloading a receipt that does not exist", async () => {
        const response = await request(app)
            .get(`/api/storage/00000000-0000-0000-0000-000000000000`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Receipt not found");
    });

    it("Fails to download another user's file", async () => {
        const response = await request(app)
            .get(`/api/storage/${other_receipt_id}`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    });

    it("Downloads a file successfully", async () => {
        const receipt = await createReceipt(second_document_id, user_id);

        const response = await request(app)
            .get(`/api/storage/${receipt.id}`)
            .set('Cookie', `token=${token}`)
            .buffer(true)
            .parse((res, callback) => {
                const chunks: Buffer[] = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => callback(null, Buffer.concat(chunks)));
            });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe("image/jpeg");
        expect(response.headers['content-disposition']).toContain("test.jpg");
        expect(response.body.length).toBeGreaterThan(0);

        await prisma.receiptVat.deleteMany({ where: { receipt_id: receipt.id } });
        await prisma.receipt.delete({ where: { id: receipt.id } });
    });

    it("Fails to upload file if file is not provided", async () => {
        const response = await request(app)
            .post("/api/storage/")
            .set('Cookie', `token=${token}`)
            .send({
                user_id: user_id
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("No files were found");
    });

    it("Fails to upload file if format is not valid", async () => {
        const response = await request(app)
            .post("/api/storage/")
            .set('Cookie', `token=${token}`)
            .attach("files", path.join(__dirname, "../fixtures/test2.docx"))
            .field("user_id", String(user_id));

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("File type not supported. Only JPEG, PNG, WEBP and PDF are allowed");
    });

    it("Gives 401 if user is not auhtenticated", async () => {
        await request(app)
            .post('/api/auth/logout')
            .set('Cookie', `token=${token}`)
        
        const response = await request(app)
            .post("/api/storage/")
            .set('Cookie', `token=${token}`)
            .attach("files", path.join(__dirname, "../fixtures/test.jpg"))
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is invalid or expired");
    });

    afterAll(async () => {
        const user = await prisma.user.findUnique({ where: { email: email } });

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

        if (other_user_id) {
            await prisma.receiptVat.deleteMany({ where: { receipt: { user_id: other_user_id } } });
            await prisma.receipt.deleteMany({ where: { user_id: other_user_id } });
            await prisma.document.deleteMany({ where: { user_id: other_user_id } });

            const otherUser = await prisma.user.findUnique({ where: { id: other_user_id } });
            if (otherUser?.supabase_id) {
                await supabaseAdmin.auth.admin.deleteUser(otherUser.supabase_id);
            }
            await prisma.user.delete({ where: { id: other_user_id } }).catch(() => {});
        }
    }, 10000);
});
