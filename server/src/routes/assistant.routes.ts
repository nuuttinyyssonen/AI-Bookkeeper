import { createChatMessage, createChatRoom, getChatRooms, getMessagesFromChatRoom, deleteChatByID } from "../controllers/assistant.controller";
import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";
import { requireSubscription } from "../middleware/subscription";

// Router
const assistantRouter = Router();

assistantRouter.post("/create", authMiddleware, requireSubscription, rateLimiters.write("create_chat_room"), createChatRoom);
assistantRouter.post("/:id", authMiddleware, requireSubscription, rateLimiters.read("crate_chat_message"), createChatMessage);
assistantRouter.get("/:id", authMiddleware, requireSubscription, rateLimiters.read("get_chat_messages"), getMessagesFromChatRoom);
assistantRouter.get("/", authMiddleware, requireSubscription, rateLimiters.read("get_chats"), getChatRooms);
assistantRouter.delete("/:id", authMiddleware, requireSubscription, rateLimiters.read("delete_chats"), deleteChatByID);

export default assistantRouter;