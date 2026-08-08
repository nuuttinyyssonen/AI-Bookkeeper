"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordSchema = exports.emailSchema = exports.signupSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email"),
    password: zod_1.z.string().min(5, "Password must be at least 5 characters")
});
exports.signupSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email"),
    password: zod_1.z.string().min(5, "Password must be at least 5 characters"),
    first_name: zod_1.z.string().min(2, "First name is required"),
    last_name: zod_1.z.string().min(2, "Last name is required"),
    phonenumber: zod_1.z.string().min(7, "Phone number is too short").max(15, "Phone number is too long"),
    business_id: zod_1.z.string().regex(/^\d{7}-\d$/, "Business ID must be in format 1234567-8")
});
exports.emailSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email"),
    platform: zod_1.z.enum(["web", "mobile"]).optional()
});
exports.passwordSchema = zod_1.z.object({
    password: zod_1.z.string().min(5).max(40, "Password must be at least 40 characters")
});
