import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { AuthenticationError } from "../utils/error";

/**
 * Logs out the authenticated user by invalidating the Supabase session and clearing the JWT cookie.
 * @param req.cookies.token - User's authentication token from cookies
 * @returns 200 with success message
 * @throws {AuthenticationError} 401 - If token is missing or session is invalid/expired
 */
export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        const err = new AuthenticationError("Not logged in");
        return next(err);
    }

    // Verify token is valid
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        const err = new AuthenticationError("Invalid or expired session");
        return next(err);
    }

    // Logout from Supabase
    await supabase.auth.signOut();

    // Clear cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    return res.status(200).json({ message: "Logged out successfully" });
};