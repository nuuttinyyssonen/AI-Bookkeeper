import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { ConflictError, ServerError } from "../utils/error";
import { stripe } from "../services/stripe.service";
import { supabaseAdmin } from "../lib/supabase";
import { Resend } from 'resend';
import { deleteFileFromSupabase } from "../services/supabase.service";

const resend = new Resend(process.env.RESEND_API_KEY);

export const getUserData = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    try {
        const subscription = await prisma.subscription.findUnique({ where: { user_id: user.id } });

        if (!subscription) {
            return res.status(200).json({ user, subscription: null, history: [] });
        }

        const invoices = await stripe.invoices.list({
            customer: subscription.stripe_customer_id,
            limit: 24,
        });

        const getPlanName = (priceId: string) => {
            switch (priceId) {
                case process.env.STRIPE_BASIC_PRICE_ID: return 'Basic — monthly';
                case process.env.STRIPE_PREMIUM_PRICE_ID: return 'Premium — monthly';
                case process.env.STRIPE_BASIC_YEARLY_PRICE_ID: return 'Basic — yearly';
                case process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID: return 'Premium — yearly';
                default: return 'Subscription';
            }
        };

        const history = invoices.data
            .filter(invoice => invoice.amount_paid > 0)
            .map(invoice => {
                const mainItem = invoice.lines.data.find((item: any) => item.amount > 0) ?? invoice.lines.data[0];
                const priceId = (mainItem as any)?.pricing?.price_details?.price ?? '';

                return {
                    id: invoice.id,
                    date: new Date(invoice.created * 1000).toLocaleDateString('fi-FI'),
                    description: getPlanName(priceId),
                    amount: `€${(invoice.amount_paid / 100).toFixed(2)}`,
                    status: invoice.status,
                    pdf: invoice.invoice_pdf,
                };
        });

        return res.status(200).json({ user, subscription, history });
    } catch (error) {
        next(error);
    }
};

export const updateUserData = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { first_name, last_name, email, phonenumber, business_id } = req.body;
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
                phonenumber: phonenumber,
                business_id: business_id
            }   
        });
        res.status(200).json({ message: "User data updated successfully" });
    } catch(error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // Querying user's subscription and cancelling it immediatelly
    // Aborting if there is and error with subscription cancel
    const subscription = await prisma.subscription.findUnique({ where: { user_id: user.id } });
    if (subscription?.stripe_subscription_id) {
        try {
            await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
            await prisma.subscription.delete({ where: { id: subscription.id } });
        } catch (error) {
            return next(new ServerError("Failed to cancel subscription. Try again"));
        }
    }
    
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

    // Sending confirmation message to user
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Account deletion',
        html: `<p>Your account has been successfully deleted.</p>`
    });

    return res.status(200).json({ message: "Your account was deleted successfully" });
};

export const getUserSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: { user_id: req.user.id },
        });

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        return res.status(200).json({ subscription });
    } catch (error) {
        next(error);
    }
};