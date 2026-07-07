import request from "supertest";
import app from "../../app";
import createUser from "../helpers/createUser";
import { prisma } from "../../lib/prisma";
import { supabaseAdmin } from "../../lib/supabase";
import redis from "../../lib/redis";

jest.mock("../../middleware/subscription", () => ({
    requireSubscription: jest.fn((req, res, next) => next())
}));

jest.mock("../../services/openai.service", () => ({
    generateChatTitle: jest.fn().mockResolvedValue("Mock chat title"),
    generateChatResponse: jest.fn().mockImplementation(async function* () {
        yield { choices: [{ delta: { content: "Hello, " } }] };
        yield { choices: [{ delta: { content: "how can I help?" } }] };
    })
}));

describe('assistant routes', () => {
    let token: string;
    let email: string;
    let user_id: string;
    let business_id: string;
    let chatroom_id: string;

    beforeAll(async () => {
        await redis.flushdb();
        email = `integration.assistant.test${Date.now()}@admin.com`;
        business_id = "2222222-4";
        const user = await createUser(email, business_id);
        user_id = user.id;
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
    });

    it('Creates a chat room successfully', async () => {
        const response = await request(app)
            .post('/api/assistant/create')
            .set('Cookie', `token=${token}`)
            .send({ message: "How much VAT do I owe this quarter?" });

        expect(response.status).toBe(201);
        expect(response.body.title).toBe("Mock chat title");
        expect(response.body.chatRoomId).toBeDefined();

        chatroom_id = response.body.chatRoomId;
    });

    it('Fails to create a chat room without a message', async () => {
        const response = await request(app)
            .post('/api/assistant/create')
            .set('Cookie', `token=${token}`)
            .send({});

        expect(response.status).toBe(400);
    });

    it('Sends a message to the chat room and streams a response', async () => {
        const response = await request(app)
            .post(`/api/assistant/${chatroom_id}`)
            .set('Cookie', `token=${token}`)
            .send({ message: "What was my total income last month?" });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/event-stream');
        expect(response.text).toContain("Hello, ");
        expect(response.text).toContain("how can I help?");
        expect(response.text).toContain("[DONE]");

        const messages = await prisma.chatMessage.findMany({ where: { chatroom_id } });
        expect(messages).toHaveLength(2);
        expect(messages.find(m => m.role === "USER")?.content).toBe("What was my total income last month?");
        expect(messages.find(m => m.role === "ASSISTANT")?.content).toBe("Hello, how can I help?");
    });

    it('Returns 404 when sending a message to a non-existent chat room', async () => {
        const response = await request(app)
            .post(`/api/assistant/00000000-0000-0000-0000-000000000000`)
            .set('Cookie', `token=${token}`)
            .send({ message: "Hello" });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("ChatRoom not found");
    });

    it('Returns 400 when chat room id is not a uuid', async () => {
        const response = await request(app)
            .post(`/api/assistant/not-a-uuid`)
            .set('Cookie', `token=${token}`)
            .send({ message: "Hello" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });

    it('Gets messages from the chat room', async () => {
        const response = await request(app)
            .get(`/api/assistant/${chatroom_id}`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.messages).toHaveLength(2);
    });

    it('Gets all chat rooms for the user', async () => {
        const response = await request(app)
            .get('/api/assistant/')
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.chatRooms).toHaveLength(1);
        expect(response.body.chatRooms[0].id).toBe(chatroom_id);
    });

    it('Deletes the chat room successfully', async () => {
        const response = await request(app)
            .delete(`/api/assistant/${chatroom_id}`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Chat deleted successfully");

        const chatRoom = await prisma.chatRoom.findUnique({ where: { id: chatroom_id } });
        expect(chatRoom).toBeNull();

        const messages = await prisma.chatMessage.findMany({ where: { chatroom_id } });
        expect(messages).toHaveLength(0);
    });

    it('Returns 401 if no token in request', async () => {
        const response = await request(app)
            .get('/api/assistant/');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is missing");
    });

    it('Returns 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/api/assistant/')
            .set('Cookie', `token=$1239218390213i90wiqdkasdnl`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is invalid or expired");
    });

    afterAll(async () => {
        if (!user_id) return;

        await prisma.chatMessage.deleteMany({ where: { chatroom: { user_id } } });
        await prisma.chatRoom.deleteMany({ where: { user_id } });

        const user = await prisma.user.findUnique({ where: { id: user_id } });
        if (user?.supabase_id) {
            await supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }

        await prisma.user.delete({ where: { id: user_id } }).catch(() => {});
    });
});
