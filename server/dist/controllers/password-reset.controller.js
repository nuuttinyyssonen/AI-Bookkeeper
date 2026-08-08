"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.sendPasswordResetLink = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const resend_1 = require("resend");
const auth_schema_1 = require("../schemas/auth.schema");
const error_1 = require("../utils/error");
const id_schema_1 = require("../schemas/id.schema");
const supabase_1 = require("../lib/supabase");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const MOBILE_APP_SCHEME = "aibookkeeper";
/**
 * Sends a password reset link to the user's email address.
 * Deletes any existing reset tokens before creating a new one with a 15-minute expiry.
 * @param req.body.email - Email address to send the reset link to
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If email fails validation
 * @throws {NotFoundError} 404 - If no user found with the provided email
 * @throws {Error} 500 - If token creation or email sending fails
 */
const sendPasswordResetLink = async (req, res, next) => {
    // Validating email with zod
    const result = auth_schema_1.emailSchema.safeParse(req.body);
    if (!result.success) {
        return next(new error_1.ValidationError(result.error.issues[0].message));
    }
    const { email, platform } = result.data;
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            return next(new error_1.NotFoundError("Email not found"));
        }
        // Delete any existing tokens for this user before creating a new one
        await prisma_1.prisma.passwordResetToken.deleteMany({ where: { user_id: user.id } });
        const token = await prisma_1.prisma.passwordResetToken.create({
            data: {
                user_id: user.id,
                expires_at: new Date(Date.now() + 15 * 60 * 1000)
            }
        });
        // Mobile has no web page to redirect back to, so Stripe redirects into the app via a deep link instead
        const url = platform === "mobile"
            ? `<p>Here is your password reset link <a href="${MOBILE_APP_SCHEME}://reset-password?token=${token.id}">Reset password</a></p>`
            : `<p>Here is your password reset link http://localhost:3000/reset-password/${token.id}.</p>`;
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Password reset link',
            html: url
        });
        return res.status(200).json({
            message: "Password reset link has been sent to your email",
            ...(platform === "mobile" && { token: token.id })
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.sendPasswordResetLink = sendPasswordResetLink;
/**
 * Resets the user's password using a valid password reset token.
 * Updates password in both Supabase auth and the database, then deletes the token to prevent reuse.
 * @param req.params.id - Password reset token ID
 * @param req.body.password - New password
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If token ID or password fails validation, or reset link has expired
 * @throws {NotFoundError} 404 - If reset token or user is not found
 * @throws {Error} 500 - If Supabase or database update fails
 */
const resetPassword = async (req, res, next) => {
    // Validating id and password with zod
    const id_result = id_schema_1.idSchema.safeParse(req.params);
    const password_result = auth_schema_1.passwordSchema.safeParse(req.body);
    if (!id_result.success) {
        return next(new error_1.ValidationError(id_result.error.issues[0].message));
    }
    if (!password_result.success) {
        return next(new error_1.ValidationError(password_result.error.issues[0].message));
    }
    const { id } = id_result.data;
    const { password } = password_result.data;
    try {
        const token = await prisma_1.prisma.passwordResetToken.findUnique({ where: { id: id } });
        if (!token) {
            return next(new error_1.NotFoundError("Invalid or expired reset link"));
        }
        if (token.expires_at < new Date()) {
            await prisma_1.prisma.passwordResetToken.delete({ where: { id: id } });
            return next(new error_1.ValidationError("Reset link has expired"));
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { id: token.user_id } });
        if (!user) {
            return next(new error_1.NotFoundError("User not found"));
        }
        if (!user.supabase_id) {
            return next(new Error("User has no linked authentication account"));
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
        const { error: supabaseError } = await supabase_1.supabaseAdmin.auth.admin.updateUserById(user.supabase_id, {
            password: password
        });
        if (supabaseError) {
            return next(new Error(supabaseError.message));
        }
        await prisma_1.prisma.user.update({ where: { id: user.id }, data: { password: passwordHash } });
        // Delete token so the link cannot be reused
        await prisma_1.prisma.passwordResetToken.delete({ where: { id: id } });
        return res.status(200).json({ message: "Password has been updated" });
    }
    catch (error) {
        return next(error);
    }
};
exports.resetPassword = resetPassword;
