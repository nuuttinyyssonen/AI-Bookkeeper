import { NextFunction, Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { prisma } from "../lib/prisma";
import { AuthenticationError } from "../utils/error";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Get token from cookie
    const token = req.cookies?.token;

    if(!token) {
        return next(new AuthenticationError("Token is missing"));
    }

    try {
        // Validate token against Supabase
        const { data, error } = await supabase.auth.getUser(token);
        if(error || !data.user) {
            return next(new AuthenticationError("Token is invalid or expired"));
        }

        // Fetch user from database and attach to request
        const user = await prisma.user.findUnique({
            where: {
                supabase_id: data.user.id
            }
        });

        if(!user) {
            return next(new AuthenticationError("User not found"));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new AuthenticationError("Authentication failed"));
    }
};
