import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { ConflictError } from "../utils/error";

export const getUserData = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        const subscription = await prisma.subscription.findUnique({ where: { user_id: user.id } });
        return res.status(200).json({ user, subscription });
    } catch(error) {
        next(error);
    }
};

export const updateUserData = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { first_name, last_name, email, phonenumber } = req.body;
    const foundUser = await prisma.user.findUnique({ where: { email: email } });
    if(foundUser && foundUser.id != user.id) {
        return next(new ConflictError("This email is already taken"));
    }
    try {
        await prisma.user.update({ 
            where: { id: user.id }, 
            data: {
                first_name: first_name,
                last_name: last_name,
                email: email,
                phonenumber: phonenumber
            }   
        });
        res.status(200).json({ message: "User data updated successfully" });
    } catch(error) {
        next(error);
    }
};