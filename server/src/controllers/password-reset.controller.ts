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
        const user = await prisma.user.findUnique({ where: { email: email } });
        if(!user) {
            return next(new NotFoundError("Email not found"));
        }

        // Delete any existing tokens for this user before creating a new one
        await prisma.passwordResetToken.deleteMany({ where: { user_id: user.id } });

        const token = await prisma.passwordResetToken.create({
            data: {
                user_id: user.id,
                expires_at: new Date(Date.now() + 15 * 60 * 1000)
            }
        });

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Password reset link',
            html: `<p>Here is your password reset link http://localhost:3000/reset-password/${token.id}.</p>`
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
        const token = await prisma.passwordResetToken.findUnique({ where: { id: id } });

        if (!token) {
            return next(new NotFoundError("Invalid or expired reset link"));
        }

        if (token.expires_at < new Date()) {
            await prisma.passwordResetToken.delete({ where: { id: id } });
            return next(new ValidationError("Reset link has expired"));
        }

        const user = await prisma.user.findUnique({ where: { id: token.user_id } });
        if (!user) {
            return next(new NotFoundError("User not found"));
        }

        if (!user.supabase_id) {
            return next(new Error("User has no linked authentication account"));
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const { error: supabaseError } = await supabaseAdmin.auth.admin.updateUserById(user.supabase_id, {
            password: password
        });

        if (supabaseError) {
            return next(new Error(supabaseError.message));
        }

        await prisma.user.update({ where: { id: user.id }, data: { password: passwordHash } });

        // Delete token so the link cannot be reused
        await prisma.passwordResetToken.delete({ where: { id: id } });

        return res.status(200).json({ message: "Password has been updated" });
    } catch(error) {
        return next(error);
    }
};