import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { NotFoundError, ServerError } from "../utils/error";

export const getVatsByReceiptId = async (req: Request<{receipt_id: string}>, res: Response, next: NextFunction) => {
    const { receipt_id } = req.params;
    if(receipt_id) {
        return next(new NotFoundError("Resource not found"));
    }

    try {
        const vats = await prisma.receiptVat.findMany({ where: { receipt_id: receipt_id } });
        return res.status(200).json({ vats });
    } catch(err) {
        return next(new ServerError("Internal server error"));
    }
};

export const getVatById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if(!id) {
        return next(new NotFoundError("Resource not found"));
    }

    try {
        const vats = await prisma.receiptVat.findUnique({ where: { id: id } });
        return res.status(200).json({ vats });
    } catch(err) {
        return next(new ServerError("Internal server error"));
    }
};