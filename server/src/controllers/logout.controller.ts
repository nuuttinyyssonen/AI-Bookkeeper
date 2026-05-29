import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export const logoutController = async (req: Request, res: Response) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Not logged in" });
    }

    // Verify token is valid
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ error: "Invalid or expired session" });
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