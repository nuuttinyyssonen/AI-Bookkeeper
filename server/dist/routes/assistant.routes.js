"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assistant_controller_1 = require("../controllers/assistant.controller");
const express_1 = require("express");
const rateLimiter_1 = require("../utils/rateLimiter");
const demoMiddleware_1 = require("../middleware/demoMiddleware");
// Router
const assistantRouter = (0, express_1.Router)();
// assistantRouter.post("/create", authMiddleware, requireSubscription, rateLimiters.write("create_chat_room"), createChatRoom);
// assistantRouter.post("/:id", authMiddleware, requireSubscription, rateLimiters.read("crate_chat_message"), createChatMessage);
assistantRouter.get("/:id", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("get_chat_messages"), assistant_controller_1.getMessagesFromChatRoom);
assistantRouter.get("/", demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.read("get_chats"), assistant_controller_1.getChatRooms);
// assistantRouter.delete("/:id", authMiddleware, requireSubscription, rateLimiters.read("delete_chats"), deleteChatByID);
exports.default = assistantRouter;
