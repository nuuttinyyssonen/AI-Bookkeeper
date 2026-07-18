import { Request, Response, NextFunction } from "express";
import { prisma } from '../lib/prisma';
import { supabase } from "../lib/supabase";
import bcrypt from 'bcrypt';
import { ConflictError, AuthenticationError } from "../utils/error";
import { loginSchema } from "../schemas/auth.schema";
import { ValidationError } from "../utils/error";

/**
 * Authenticates a user with email and password.
 * Validates credentials against the database and signs in via Supabase to obtain a JWT.
 * @param req.body.email - User's email address
 * @param req.body.password - User's password
 * @returns 200 with user object containing JWT token and profile fields
 * @throws {ValidationError} 400 - If email or password fails validation
 * @throws {ConflictError} 409 - If email or password is incorrect
 * @throws {AuthenticationError} 401 - If Supabase authentication fails
 */
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    // Getting user's email and password from the request with using zod schema.
    const result = loginSchema.safeParse(req.body);
    
    if (!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { email, password } = result.data;

    // Finding user from database
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    // Checking is provided password matches with user's password in database
    const passwordCorrect = user ? await bcrypt.compare(password, user.password) : false;
    if(!(passwordCorrect && user)) {
        const err = new ConflictError("Password or email is not correct");
        return next(err);
    }

    // Logging in to Supabase and getting session + JWT token
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error || !data.session) {
        const err = new AuthenticationError("Authentication error");
        return next(err);
    }

    return res.status(200)
    .json({
        user: {
            token: data.session.access_token,
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phonenumber: user.phonenumber
        }
    });
};