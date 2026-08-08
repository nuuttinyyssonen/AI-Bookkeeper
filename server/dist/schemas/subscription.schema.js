"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutSchema = exports.subscriptionTypeSchema = void 0;
const zod_1 = require("zod");
exports.subscriptionTypeSchema = zod_1.z.object({
    subscriptionType: zod_1.z.string().min(1).max(20, "Invalid subscription type")
});
exports.checkoutSchema = zod_1.z.object({
    subscriptionType: zod_1.z.string().min(1).max(20, "Invalid subscription type"),
    user_id: zod_1.z.uuid("Invalid user_id format"),
    platform: zod_1.z.enum(["web", "mobile"]).optional()
});
