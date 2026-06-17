import { createChatMessage, createChatRoom, getChatRooms, getMessagesFromChatRoom } from "../controllers/assistant.controller";
import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const assistantRouter = Router();

assistantRouter.post("/create", authMiddleware, rateLimiters.write("create_chat_room"), createChatRoom);
assistantRouter.post("/:id", authMiddleware, rateLimiters.read("crate_chat_message"), createChatMessage);
assistantRouter.get("/:id", authMiddleware, rateLimiters.read("get_chat_messages"), getMessagesFromChatRoom);
assistantRouter.get("/", authMiddleware, rateLimiters.read("get_chats"), getChatRooms);

export default assistantRouter;