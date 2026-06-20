import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { chatMessageSchema } from "../schemas/chat.schema";
import { idSchema } from "../schemas/id.schema";
import { ValidationError, NotFoundError } from "../utils/error";
import { chatQueue } from "../queues/queue";
import { generateChatResponse } from "../services/openai.service";


// New chatroom
export const createChatRoom = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = chatMessageSchema.safeParse(req.body);
    if (!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }
    const { message } = result.data;
    try {
        const chatRoom = await prisma.chatRoom.create({ data: { user_id: user.id } });

        // save user message
        await prisma.chatMessage.create({
            data: { content: message, chatroom_id: chatRoom.id, role: "USER" }
        });

        // set streaming headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        // send chatRoomId first so frontend can navigate
        res.write(`data: ${JSON.stringify({ chatRoomId: chatRoom.id })}\n\n`);

        const stream = await generateChatResponse(message, [], true);

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

// Message to chatroom
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

export const getMessagesFromChatRoom = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const result = idSchema.safeParse(req.params);
    if (!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }
    const { id } = result.data;

    try {
        const messages = await prisma.chatMessage.findMany({ where: { chatroom_id: id } });
        return res.status(200).json({ messages });
    } catch(error) {
        next(error);
    }
};

export const getChatRooms = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        const chatRooms = await prisma.chatRoom.findMany({ where: { user_id: user.id } });
        return res.status(200).json({ chatRooms });
    } catch(error) {
        next(error);
    }
};