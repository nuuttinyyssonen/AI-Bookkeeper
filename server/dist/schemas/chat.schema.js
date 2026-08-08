"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMessageSchema = void 0;
const zod_1 = require("zod");
exports.chatMessageSchema = zod_1.z.object({
    message: zod_1.z.string().min(1).max(1000)
});
