"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantSubscription = exports.deleteUserByEmail = void 0;
const prisma_1 = require("../lib/prisma");
const supabase_1 = require("../lib/supabase");
const error_1 = require("../utils/error");
const client_1 = require("@prisma/client");
const supabase_service_1 = require("../services/supabase.service");
/**
 * Cypress controller route meant for clean up in E2E tests. Deletes user and all data user has.
 * Deletes in order: subscription, VAT reports, receipts, documents (Supabase storage + DB),
 * chat messages, chat rooms, Supabase auth user, and finally the DB user record.
 * @param {Request} req.body.email - Email of the user to delete
 * @returns 200 with success message, or "No user to delete" if user not found
 * @throws {ServerError} 500 - If deletion of receipts, files, chat data, or user fails
 */
const deleteUserByEmail = async (req, res, next) => {
    const { email } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
        return res.status(200).json({ message: "No user to delete" });
    }
    // Querying user's subscription and cancelling it immediatelly
    // Aborting if there is and error with subscription cancel
    await prisma_1.prisma.subscription.deleteMany({ where: { user_id: user.id } });
    // Deleting Vat reports, receipts-vats and receipt if there are any
    try {
        await prisma_1.prisma.vatReport.deleteMany({ where: { user_id: user.id } });
        await prisma_1.prisma.receiptVat.deleteMany({ where: { receipt: { user_id: user.id } } });
        await prisma_1.prisma.receipt.deleteMany({ where: { user_id: user.id } });
    }
    catch (error) {
        return next(new error_1.ServerError("Failed to delete receipts"));
    }
    // Deleting all document files from supabase. If we get error we abort immediatelly
    try {
        const documents = await prisma_1.prisma.document.findMany({ where: { user_id: user.id } });
        // Promise.allSettled attempts all deletions regardless of individual failures and never throws.
        await Promise.allSettled(documents.map(d => (0, supabase_service_1.deleteFileFromSupabase)(d.document_name)));
        // Delete documents from DB
        await prisma_1.prisma.document.deleteMany({ where: { user_id: user.id } });
    }
    catch (error) {
        return next(new error_1.ServerError("Failed to delete files"));
    }
    // Deleting all chat rooms and messages in them
    try {
        await prisma_1.prisma.chatMessage.deleteMany({
            where: { chatroom: { user_id: user.id } }
        });
        await prisma_1.prisma.chatRoom.deleteMany({ where: { user_id: user.id } });
    }
    catch (error) {
        return next(new error_1.ServerError("Failed to delete AI assistant messages"));
    }
    // Delete supabase auth user before deleting user
    if (user.supabase_id) {
        const { error } = await supabase_1.supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        if (error) {
            return next(new error_1.ServerError("Failed to delete user. Try again"));
        }
    }
    // Deleting user from DB
    try {
        await prisma_1.prisma.user.delete({ where: { id: user.id } });
    }
    catch (error) {
        return next(new error_1.ServerError("Failed to delete user. Try again"));
    }
    return res.status(200).json({ message: "Your account was deleted successfully" });
};
exports.deleteUserByEmail = deleteUserByEmail;
/**
 * Cypress controller route meant for E2E tests to give user's susbcription.
 * @param {Request} req.body.email - Email of the user to delete
 * @returns 200 with success message
 * @throws {ServerError} 500 - If granting susbcription or DB operations fail
 */
const grantSubscription = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new error_1.NotFoundError("Email not found"));
    }
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            return next(new error_1.NotFoundError("User not found"));
        }
        await prisma_1.prisma.subscription.upsert({
            where: { user_id: user.id },
            update: {
                subscription_status: client_1.SubscriptionStatus.ACTIVE,
                current_period_end: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
            create: {
                user_id: user.id,
                subscription_type: client_1.SubscriptionType.BASIC,
                subscription_status: client_1.SubscriptionStatus.ACTIVE,
                stripe_subscription_id: `test_${user.id}`,
                stripe_customer_id: `test_${user.id}`,
                stripe_price_id: "test_price",
                current_period_start: new Date(),
                current_period_end: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
        return res.status(200).json({ message: "Subscription granted" });
    }
    catch (error) {
        return next(error);
    }
};
exports.grantSubscription = grantSubscription;
