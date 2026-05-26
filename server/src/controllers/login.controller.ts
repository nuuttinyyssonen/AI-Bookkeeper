import { Request, Response } from "express";
import { prisma } from '../lib/prisma';
import { supabase } from "../lib/supabase";
import bcrypt from 'bcrypt';

export const loginController = async (req: Request, res: Response) => {
    // Getting user's email and password from the request
    const { email, password } = req.body;

    // Finding user from database
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    // Checking is provided password matches with user's password in database
    const passwordCorrect = user ? await bcrypt.compare(password, user.password) : false;
    if(!(passwordCorrect && user)) {
        return res.status(401).json({ "error": "Password or email is not correct" });
    }

    // Logging in to Supabase and getting session + JWT token
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error || !data.session) {
        return res.status(401).json({ error: "Authentication failed" });
    }

    return res.status(200).json({
        token: data.session?.access_token,
        user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phonenumber: user.phonenumber
        }
    });
};