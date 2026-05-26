import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export const logoutController = async (req: Request, res: Response) => {
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