import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { supabaseAdmin } from "../lib/supabase";
import { NotFoundError, ServerError } from "../utils/error";

export const deleteUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if(!email) {
        return next(new NotFoundError("Email not found"));
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: email } });
        if(!user) {
            return res.status(200).json({ message: "No user found, nothing to delete" });
        }
        if (user.supabase_id) {
            const { error } = await supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
            if (error) {
                return next(new ServerError("Failed to delete user. Try again"));
            }
        }
        await prisma.user.delete({ where: { email: email } });
        return res.status(200).json({ message: "User deleted successfully" });
    } catch(error) {
        return next(error)
    }
};