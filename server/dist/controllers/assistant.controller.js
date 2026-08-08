"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChatByID = exports.getChatRooms = exports.getMessagesFromChatRoom = exports.createChatMessage = exports.createChatRoom = void 0;
const prisma_1 = require("../lib/prisma");
const chat_schema_1 = require("../schemas/chat.schema");
const id_schema_1 = require("../schemas/id.schema");
const error_1 = require("../utils/error");
const openai_service_1 = require("../services/openai.service");
/**
 * Creates a new chat room with an AI-generated title based on the initial message.
 * @param {Request} req.body - Initial message in the body
 * @param {Request} req.user - User from auth middleware
 * @returns {201} Creates chat room, inserts first message and returns chatroom id and title.
 * @throws {ValidationError} 400 - If request body fails validation
 * @throws {Error} 500 - If chat room creation or title generation fails
 */
const createChatRoom = async (req, res, next) => {
    const user = req.user;
    const result = chat_schema_1.chatMessageSchema.safeParse(req.body);
    if (!result.success) {
        return next(new error_1.ValidationError(result.error.issues[0].message));
    }
    const { message } = result.data;
    try {
        const [chatRoom, title] = await Promise.all([
            prisma_1.prisma.chatRoom.create({ data: { user_id: user.id } }),
            (0, openai_service_1.generateChatTitle)(message)
        ]);
        await prisma_1.prisma.chatRoom.update({ where: { id: chatRoom.id }, data: { title } });
        return res.status(201).json({ chatRoomId: chatRoom.id, title });
    }
    catch (error) {
        next(error);
    }
};
exports.createChatRoom = createChatRoom;
/**
 * Sends a message to an existing chat room and streams the AI response using SSE.
 * @param {Request} req.body - Chat message
 * @param {Request} req.params - ID of the chat room
 * @param {Request} req.user - User from auth middleware
 * @returns Streams AI response chunks as Server-Sent Events, ends with [DONE]
 * @throws {ValidationError} 400 - If message or chat room ID fails validation
 * @throws {NotFoundError} 404 - If chat room not found or does not belong to user
 * @throws {Error} 500 - If AI generation or database operations fail
 */
const createChatMessage = async (req, res, next) => {
    const user = req.user;
    const resultMessage = chat_schema_1.chatMessageSchema.safeParse(req.body);
    const resultID = id_schema_1.idSchema.safeParse(req.params);
    if (!resultMessage.success)
        return next(new error_1.ValidationError(resultMessage.error.issues[0].message));
    if (!resultID.success)
        return next(new error_1.ValidationError(resultID.error.issues[0].message));
    const { message } = resultMessage.data;
    const { id } = resultID.data;
    try {
        const chatRoom = await prisma_1.prisma.chatRoom.findUnique({ where: { id, user_id: user.id } });
        if (!chatRoom)
            return next(new error_1.NotFoundError("ChatRoom not found"));
        // fetch history for context
        const history = await prisma_1.prisma.chatMessage.findMany({
            where: { chatroom_id: chatRoom.id },
            orderBy: { created_at: "asc" }
        });
        // save user message
        await prisma_1.prisma.chatMessage.create({
            data: { content: message, chatroom_id: chatRoom.id, role: "USER" }
        });
        // set streaming headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        const stream = await (0, openai_service_1.generateChatResponse)(message, history, true);
        let fullResponse = "";
        for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            fullResponse += text;
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
        // save complete AI response
        await prisma_1.prisma.chatMessage.create({
            data: { content: fullResponse, chatroom_id: chatRoom.id, role: "ASSISTANT" }
        });
        res.write("data: [DONE]\n\n");
        res.end();
    }
    catch (error) {
        next(error);
    }
};
exports.createChatMessage = createChatMessage;
/**
 * Gets all user's and AI's messages from chat room with id.
 * @param {Request} req.params - Chat room ID
 * @returns 200 with object containing messages array
 * @throws {ValidationError} 400 - If chat room ID fails validation
 * @throws {Error} 500 - If database operations fail
 */
const getMessagesFromChatRoom = async (req, res, next) => {
    const user = req.user;
    const result = id_schema_1.idSchema.safeParse(req.params);
    if (!result.success) {
        return next(new error_1.ValidationError(result.error.issues[0].message));
    }
    const { id } = result.data;
    try {
        const messages = await prisma_1.prisma.chatMessage.findMany({ where: { chatroom_id: id, chatroom: { user_id: user.id } } });
        return res.status(200).json({ messages });
    }
    catch (error) {
        next(error);
    }
};
exports.getMessagesFromChatRoom = getMessagesFromChatRoom;
/**
 * Gets all user's chat rooms with user_id
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with object containing chatRooms array
 * @throws {Error} 500 - If database operations fail unexpectedly
 */
const getChatRooms = async (req, res, next) => {
    const user = req.user;
    try {
        const chatRooms = await prisma_1.prisma.chatRoom.findMany({ where: { user_id: user.id } });
        return res.status(200).json({ chatRooms });
    }
    catch (error) {
        next(error);
    }
};
exports.getChatRooms = getChatRooms;
/**
 * Deletes chat by id from request params.
 * @param {Request} req.params - Chat room ID
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If chat room ID fails validation
 * @throws {Error} 500 - If database operations fail unexpectedly
 */
const deleteChatByID = async (req, res, next) => {
    const user = req.user;
    const result = id_schema_1.idSchema.safeParse(req.params);
    if (!result.success) {
        return next(new error_1.ValidationError(result.error.issues[0].message));
    }
    const { id } = result.data;
    try {
        await prisma_1.prisma.chatMessage.deleteMany({ where: { chatroom_id: id, chatroom: { user_id: user.id } } });
        await prisma_1.prisma.chatRoom.delete({ where: { id: id, user_id: user.id } });
        return res.status(200).json({ message: "Chat deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteChatByID = deleteChatByID;
