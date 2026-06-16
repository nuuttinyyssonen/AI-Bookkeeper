import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { chatMessageSchema } from "../schemas/chat.schema";
import { ValidationError } from "../utils/error";
import { chatQueue } from "../queues/queue";


export const createChatMessage = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    // Getting user's chat message from the request with using zod schema.
    const result = chatMessageSchema.safeParse(req.body);
    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message))
    }

    const { message, chatRoomID } = result.data;

    try {
        let chatRoom;
        // Check if room id exists, if it don't, create new one.
        if (!chatRoomID) {
            chatRoom = await prisma.chatRoom.create({ data: { user_id: user.id } });
        } else {
            chatRoom = await prisma.chatRoom.findUnique({ where: { id: chatRoomID } });
        }

        if (!chatRoom) {
            return next(new ValidationError("ChatRoom not found"));
        }

        // Save user's message to DB
        const chatMessage = await prisma.chatMessage.create({
            data: {
                content: message,
                chatroom_id: chatRoom.id,
                role: "USER"
            }
        });

        // Add queue for AI response
        await chatQueue.add("process-message", {
            chatRoomId: chatRoom.id,
            messageId: chatMessage.id,
            message
        });

        return res.status(201).json({ 
            chatRoomId: chatRoom.id,
            messageId: chatMessage.id
        });
    } catch(error) {
        next(error);
    }
}; 