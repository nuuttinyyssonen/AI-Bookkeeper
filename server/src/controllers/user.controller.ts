import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { ConflictError } from "../utils/error";
import { stripe } from "../services/stripe.service";

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