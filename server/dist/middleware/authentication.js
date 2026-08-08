"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const supabase_1 = require("../lib/supabase");
const prisma_1 = require("../lib/prisma");
const error_1 = require("../utils/error");
const authMiddleware = async (req, res, next) => {
    // Native sends: Authorization: Bearer <token>
    // Web sends: cookie
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    const token = bearerToken || req.cookies?.token;
    if (!token) {
        return next(new error_1.AuthenticationError("Token is missing"));
    }
    try {
        // Validate token against Supabase
        const { data, error } = await supabase_1.supabase.auth.getUser(token);
        if (error || !data.user) {
            return next(new error_1.AuthenticationError("Token is invalid or expired"));
        }
        // Fetch user from database and attach to request
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                supabase_id: data.user.id
            }
        });
        if (!user) {
            return next(new error_1.AuthenticationError("User not found"));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new error_1.AuthenticationError("Authentication failed"));
    }
};
exports.authMiddleware = authMiddleware;
