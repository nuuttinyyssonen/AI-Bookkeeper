import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { chatMessageSchema } from "../schemas/chat.schema";
import { idSchema } from "../schemas/id.schema";
import { ValidationError, NotFoundError } from "../utils/error";
import { chatQueue } from "../queues/queue";


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
        const chatMessage = await prisma.chatMessage.create({
            data: { content: message, chatroom_id: chatRoom.id, role: "USER" }
        });
        await chatQueue.add("process-message", { chatRoomId: chatRoom.id, messageId: chatMessage.id, message });
        return res.status(201).json({ chatRoomId: chatRoom.id, messageId: chatMessage.id });
    } catch(error) {
        next(error);
    }
};

// Message to chatroom
export const createChatMessage = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const user = req.user;
    const resultMessage = chatMessageSchema.safeParse(req.body);
    const resultID = idSchema.safeParse(req.params);

    if (!resultMessage.success) {
        return next(new ValidationError(resultMessage.error.issues[0].message));
    }
    if (!resultID.success) {
        return next(new ValidationError(resultID.error.issues[0].message));
    };

    const { message } = resultMessage.data;
    const { id } = resultID.data;

    try {
        const chatRoom = await prisma.chatRoom.findUnique({ where: { id, user_id: user.id } });
        if (!chatRoom) return next(new NotFoundError("ChatRoom not found"));
        const chatMessage = await prisma.chatMessage.create({
            data: { content: message, chatroom_id: chatRoom.id, role: "USER" }
        });
        await chatQueue.add("process-message", { chatRoomId: chatRoom.id, messageId: chatMessage.id, message });
        return res.status(201).json({ chatRoomId: chatRoom.id, messageId: chatMessage.id });
    } catch(error) {
        next(error);
    }
};