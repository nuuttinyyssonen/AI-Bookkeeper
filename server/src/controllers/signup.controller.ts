import { prisma } from '../lib/prisma';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { supabaseAdmin } from '../lib/supabase';
import { ValidationError, ConflictError, ServerError } from '../utils/error';
import { signupSchema } from '../schemas/auth.schema';
import { idSchema } from '../schemas/id.schema';

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
    // Getting user's data from request body
    // Validation with zod schema
    const result = signupSchema.safeParse(req.body);
    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { email, password, first_name, last_name, phonenumber } = result.data;

    // Querying user to see if it already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        const err = new ConflictError("Email is already in use");
        return next(err);
    }

    // Password hashing
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Creating user in Supabase Auth
    const { data: supabaseData, error: supabaseError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });

    if (supabaseError || !supabaseData.user) {
        return res.status(500).json({ error: "Failed to create user in Supabase" });
    }

    // Creating user in database
    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                password: passwordHash,
                first_name,
                last_name,
                phonenumber,
                supabase_id: supabaseData.user.id
            }
        });

        return res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name
        });
    } catch (error) {
        // If Prisma fails, delete user from supabase
        await supabaseAdmin.auth.admin.deleteUser(supabaseData.user.id);
        const err = new ServerError("Internal Server Error");
        return next(err);
    }
};

export const deleteUser = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    // Validation with zod schema
    const result = idSchema.safeParse(req.body);
    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }
    const { id } = result.data;
    
    try {
        await prisma.user.delete({ where: { id: id } });
        res.json({ message: 'User deleted' });
    } catch (error) {
        return next(error);
    }
};