import { prisma } from "../../lib/prisma";
import request from "supertest";
import createUser from "../helpers/createUser";
import app from "../../app";
import { supabaseAdmin } from "../../lib/supabase";
import path from 'path';

describe("Storage routes", () => {
    let email: string;
    let user_id: number;
    let fileName: string;
    let token: string;

    beforeAll(async () => {
        email = `integration.storage.test${Date.now()}@admin.com`;
        const user = await createUser(email);
        user_id = user.id;

        // Login to get token
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email, password: "123456" });
        token = response.body.user.token;
    });

    it("Uploads file successfully", async () => {
        const response = await request(app)
            .post("/api/storage/")
            .set('Cookie', `token=${token}`)
            .attach("files", path.join(__dirname, "../fixtures/test.webp"))

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toMatchObject({
            user_id,
            document_type: "image/webp",
            document_size: 4914
        });

        fileName = response.body[0].document_name;
        expect(fileName).toContain("test.webp");
    });

    it("Deletes file successfully", async () => {
        const response = await request(app)
            .delete("/api/storage/")
            .set('Cookie', `token=${token}`)
            .send({
                fileName: fileName
            })
        
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

    it("Fails to delete file if fileName is not provided", async () => {
        const response = await request(app)
            .delete("/api/storage/")
            .set('Cookie', `token=${token}`)
        
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("File name is required");
    });

    it("Fails to delete file if fileName is not valid", async () => {
        const response = await request(app)
            .delete("/api/storage/")
            .set('Cookie', `token=${token}`)
            .send({
                fileName: "test"
            })
        
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("File not found");
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
