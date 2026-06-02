import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError, ServerError } from '../utils/error';

export const getAllReceiptsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        const receipts = await prisma.receipt.findMany({
            where: {
                user_id: user.id
            },
            include: {
                receiptVats: true
            }
        });

        return res.status(200).json({ receipts });
    } catch (err) {
        next(new ServerError("Internal server error"));
    }
};

export const getReceiptById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if(!id) {
        return next(new NotFoundError("Resource not found"));
    }

    try {
        const receipt = await prisma.receipt.findUnique({ where: { id } });
        return res.status(200).json({ receipt });
    } catch (err) {
        return next(new ServerError("Internal server error"));
    }
};
