import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { supabaseAdmin } from "../lib/supabase";
import { NotFoundError, ServerError } from "../utils/error";
import { SubscriptionStatus, SubscriptionType } from "@prisma/client";
import { deleteFileFromSupabase } from "../services/supabase.service";

/**
 * Cypress controller route meant for clean up in E2E tests. Deletes user and all data user has.
 * Deletes in order: subscription, VAT reports, receipts, documents (Supabase storage + DB),
 * chat messages, chat rooms, Supabase auth user, and finally the DB user record.
 * @param {Request} req.body.email - Email of the user to delete
 * @returns 200 with success message, or "No user to delete" if user not found
 * @throws {ServerError} 500 - If deletion of receipts, files, chat data, or user fails
 */
export const deleteUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email: email } });
    if(!user) {
        return res.status(200).json({ message: "No user to delete" });
    }
    
    // Querying user's subscription and cancelling it immediatelly
    // Aborting if there is and error with subscription cancel
    await prisma.subscription.deleteMany({ where: { user_id: user.id } });
    
    // Deleting Vat reports, receipts-vats and receipt if there are any
    try {
        await prisma.vatReport.deleteMany({ where: { user_id: user.id } });
        await prisma.receiptVat.deleteMany({ where: { receipt: { user_id: user.id } } });
        await prisma.receipt.deleteMany({ where: { user_id: user.id } });
    } catch (error) {
        return next(new ServerError("Failed to delete receipts"));
    }

    // Deleting all document files from supabase. If we get error we abort immediatelly
    try {
        const documents = await prisma.document.findMany({ where: { user_id: user.id } });
        
        // Promise.allSettled attempts all deletions regardless of individual failures and never throws.
        await Promise.allSettled(documents.map(d => deleteFileFromSupabase(d.document_name)));
        // Delete documents from DB
        await prisma.document.deleteMany({ where: { user_id: user.id } });
    } catch (error) {
        return next(new ServerError("Failed to delete files"));
    }

    // Deleting all chat rooms and messages in them
    try {
        await prisma.chatMessage.deleteMany({
            where: { chatroom: { user_id: user.id } }
        });
        await prisma.chatRoom.deleteMany({ where: { user_id: user.id } });
    } catch (error) {
        return next(new ServerError("Failed to delete AI assistant messages"));
    }

    // Delete supabase auth user before deleting user
    if (user.supabase_id) {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        if (error) {
            return next(new ServerError("Failed to delete user. Try again"));
        }
    }

    // Deleting user from DB
    try {
        await prisma.user.delete({ where: { id: user.id } });
    } catch (error) {
        return next(new ServerError("Failed to delete user. Try again"));
    }

    return res.status(200).json({ message: "Your account was deleted successfully" });
};

/**
 * Cypress controller route meant for E2E tests to give user's susbcription.
 * @param {Request} req.body.email - Email of the user to delete
 * @returns 200 with success message
 * @throws {ServerError} 500 - If granting susbcription or DB operations fail
 */
export const grantSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
        return next(new NotFoundError("Email not found"));
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            return next(new NotFoundError("User not found"));
        }

        await prisma.subscription.upsert({
            where: { user_id: user.id },
            update: {
                subscription_status: SubscriptionStatus.ACTIVE,
                current_period_end: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
            create: {
                user_id: user.id,
                subscription_type: SubscriptionType.BASIC,
                subscription_status: SubscriptionStatus.ACTIVE,
                stripe_subscription_id: `test_${user.id}`,
                stripe_customer_id: `test_${user.id}`,
                stripe_price_id: "test_price",
                current_period_start: new Date(),
                current_period_end: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        return res.status(200).json({ message: "Subscription granted" });
    } catch (error) {
        return next(error);
    }
};