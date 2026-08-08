"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createUser;
const prisma_1 = require("../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const supabase_1 = require("../../lib/supabase");
async function createUser(email, business_id) {
    const password = "123456";
    const saltRounds = 10;
    const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
    const { data: supabaseData, error: supabaseError } = await supabase_1.supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });
    if (supabaseError || !supabaseData.user) {
        throw new Error("Failed to create Supabase test user");
    }
    const user = await prisma_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            first_name: "test",
            last_name: "user",
            phonenumber: "040123456",
            supabase_id: supabaseData.user.id,
            business_id
        }
    });
    return user;
}
