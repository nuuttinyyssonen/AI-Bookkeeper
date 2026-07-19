import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { chatMessageSchema } from "../schemas/chat.schema";
import { idSchema } from "../schemas/id.schema";
import { ValidationError, NotFoundError } from "../utils/error";
import { generateChatResponse, generateChatTitle } from "../services/openai.service";


/**
 * Creates a new chat room with an AI-generated title based on the initial message.
 * @param {Request} req.body - Initial message in the body
 * @param {Request} req.user - User from auth middleware
 * @returns {201} Creates chat room, inserts first message and returns chatroom id and title.
 * @throws {ValidationError} 400 - If request body fails validation
 * @throws {Error} 500 - If chat room creation or title generation fails
 */
export const createChatRoom = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = chatMessageSchema.safeParse(req.body);
    if (!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }
    const { message } = result.data;
    try {
        const [chatRoom, title] = await Promise.all([
            prisma.chatRoom.create({ data: { user_id: user.id } }),
            generateChatTitle(message)
        ]);

        await prisma.chatRoom.update({ where: { id: chatRoom.id }, data: { title } });

        return res.status(201).json({ chatRoomId: chatRoom.id, title });
    } catch(error) {
        next(error);
    }
};

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
export const createChatMessage = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const user = req.user;
    const resultMessage = chatMessageSchema.safeParse(req.body);
    const resultID = idSchema.safeParse(req.params);

    if (!resultMessage.success) return next(new ValidationError(resultMessage.error.issues[0].message));
    if (!resultID.success) return next(new ValidationError(resultID.error.issues[0].message));

    const { message } = resultMessage.data;
    const { id } = resultID.data;

    try {
        const chatRoom = await prisma.chatRoom.findUnique({ where: { id, user_id: user.id } });
        if (!chatRoom) return next(new NotFoundError("ChatRoom not found"));

        // fetch history for context
        const history = await prisma.chatMessage.findMany({
            where: { chatroom_id: chatRoom.id },
            orderBy: { created_at: "asc" }
        });

        // save user message
        await prisma.chatMessage.create({
            data: { content: message, chatroom_id: chatRoom.id, role: "USER" }
        });

        // set streaming headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const stream = await generateChatResponse(message, history, true);

        let fullResponse = "";

        for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            fullResponse += text;
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }

        // save complete AI response
        await prisma.chatMessage.create({
            data: { content: fullResponse, chatroom_id: chatRoom.id, role: "ASSISTANT" }
        });

        res.write("data: [DONE]\n\n");
        res.end();

    } catch(error) {
        next(error);
    }
};

/**
 * Gets all user's and AI's messages from chat room with id.
 * @param {Request} req.params - Chat room ID
 * @returns 200 with object containing messages array
 * @throws {ValidationError} 400 - If chat room ID fails validation
 * @throws {Error} 500 - If database operations fail
 */
export const getMessagesFromChatRoom = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const user = req.user
    const result = idSchema.safeParse(req.params);
    if (!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }
    const { id } = result.data;

    try {
        const messages = await prisma.chatMessage.findMany({ where: { chatroom_id: id, chatroom: { user_id: user.id } } });
        return res.status(200).json({ messages });
    } catch(error) {
        next(error);
    }
};

/**
 * Gets all user's chat rooms with user_id
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with object containing chatRooms array
 * @throws {Error} 500 - If database operations fail unexpectedly
 */
export const getChatRooms = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        const chatRooms = await prisma.chatRoom.findMany({ where: { user_id: user.id } });
        return res.status(200).json({ chatRooms });
    } catch(error) {
        next(error);
    }
};

/**
 * Deletes chat by id from request params.
 * @param {Request} req.params - Chat room ID
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If chat room ID fails validation
 * @throws {Error} 500 - If database operations fail unexpectedly
 */
export const deleteChatByID = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = idSchema.safeParse(req.params);
    if (!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }
    const { id } = result.data;

    try {
        await prisma.chatMessage.deleteMany({ where: { chatroom_id: id, chatroom: { user_id: user.id} } });
        await prisma.chatRoom.delete({ where: { id: id, user_id: user.id } });
        return res.status(200).json({ message: "Chat deleted successfully" });
    } catch(error) {
        next(error);
    }
};