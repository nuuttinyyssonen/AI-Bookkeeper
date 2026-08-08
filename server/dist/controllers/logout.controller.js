"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = void 0;
const supabase_1 = require("../lib/supabase");
const error_1 = require("../utils/error");
/**
 * Logs out the authenticated user by invalidating the Supabase session and clearing the JWT cookie.
 * @param req.cookies.token - User's authentication token from cookies
 * @returns 200 with success message
 * @throws {AuthenticationError} 401 - If token is missing or session is invalid/expired
 */
const logoutController = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        const err = new error_1.AuthenticationError("Not logged in");
        return next(err);
    }
    // Verify token is valid
    const { data, error } = await supabase_1.supabase.auth.getUser(token);
    if (error || !data.user) {
        const err = new error_1.AuthenticationError("Invalid or expired session");
        return next(err);
    }
    // Logout from Supabase
    await supabase_1.supabase.auth.signOut();
    // Clear cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    return res.status(200).json({ message: "Logged out successfully" });
};
exports.logoutController = logoutController;
