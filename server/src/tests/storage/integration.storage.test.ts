import { prisma } from "../../lib/prisma";
import request from "supertest";
import createUser from "../helpers/createUser";
import app from "../../app";
import { supabaseAdmin } from "../../lib/supabase";
import path from 'path';
import createReceipt from "../helpers/createReceipt";

jest.mock("../../queues/queue", () => ({
    receiptQueue: {
        add: jest.fn().mockResolvedValue({ id: "mock-job-1" })
    }
}));

describe("Storage routes", () => {
    let email: string;
    let user_id: string;
    let document_id: string;
    let fileName: string;
    let token: string;
    let receipt_id: string;

    beforeAll(async () => {
        email = `integration.storage.test${Date.now()}@admin.com`;
        const user = await createUser(email);
        user_id = user.id;

        // Login to get token
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email, password: "123456" });
        token = response.body.user.token;

        const storageResponse = await request(app)
            .post("/api/storage/")
            .set('Cookie', `token=${token}`)
            .attach("files", path.join(__dirname, "../fixtures/test.jpg"))
        document_id = storageResponse.body[0].id;
        
        const receipt = await createReceipt(document_id, user_id);
        receipt_id = receipt.id;
    });

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
    });
});
