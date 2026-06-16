import { createChatMessage, createChatRoom } from "../controllers/assistant.controller";
import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const assistantRouter = Router();

assistantRouter.post("/create", authMiddleware, rateLimiters.write("create_chat_room"), createChatRoom);
assistantRouter.post("/:id", authMiddleware, rateLimiters.read("crate_chat_message"), createChatMessage);

export default assistantRouter;