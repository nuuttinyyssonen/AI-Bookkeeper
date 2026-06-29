import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import { prisma } from "../lib/prisma";
import { Resend } from 'resend';
import { emailSchema, passwordSchema } from "../schemas/auth.schema";
import { NotFoundError, ValidationError } from "../utils/error";
import { idSchema } from "../schemas/id.schema";
import { supabaseAdmin } from "../lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetLink = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    // Validating email with zod
    const result = emailSchema.safeParse(req.body);

    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { email } = result.data;

    try {
        // Querying user and validating that it exists with given email
        const user = await prisma.user.findUnique({ where: { email: email } });
        if(!user) {
            return next(new NotFoundError("Email not found"));
        }

        console.log(user.email)

        // Sending email with link embedded with resend
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Password reset link',
            html: `<p>Here is your password reset link http://localhost:3000/reset-password/${user.id}.</p>`
        });

        return res.status(200).json({ message: "Password reset link has been sent to your email" });
    } catch(error) {
        return next(error);
    }
};

export const resetPassword = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    console.log(req.body)

    // Validating id and password with zod
    const id_result = idSchema.safeParse(req.params);
    const password_result = passwordSchema.safeParse(req.body);

    if(!id_result.success) {
        return next(new ValidationError(id_result.error.issues[0].message));
    }

    if(!password_result.success) {
        return next(new ValidationError(password_result.error.issues[0].message));
    }

    const { id } = id_result.data;
    const { password } = password_result.data;

    try {
        // Hashing new password with bcrypt
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Validating that user with id exists
        const user = await prisma.user.findUnique({ where: { id: id } });
        if(!user) {
            return next(new NotFoundError("User not found"));
        }

        if (!user.supabase_id) {
            return next(new Error("User has no linked authentication account"));
        }

        const { error: supabaseError } = await supabaseAdmin.auth.admin.updateUserById(user.supabase_id, {
            password: password
        });

        if (supabaseError) {
            return next(new Error(supabaseError.message));
        }


        // Finding user with id from params and updating its password
        await prisma.user.update({ 
            where: { id: id }, 
            data: { password: passwordHash } 
        });

        return res.status(200).json({ message: "Password has been updated" });
    } catch(error) {
        return next(error);
    }
};