import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { NotFoundError, ServerError } from "../utils/error";
import { idSchema, receiptIdSchema } from "../schemas/id.schema";
import { ValidationError } from "../utils/error";

export const getVatsByReceiptId = async (req: Request<{receipt_id: string}>, res: Response, next: NextFunction) => {
    // Getting id from params and validating with zod
    const result = receiptIdSchema.safeParse(req.params);
    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { receipt_id } = result.data;

    try {
        const vats = await prisma.receiptVat.findMany({ where: { receipt_id: receipt_id } });
        return res.status(200).json({ vats });
    } catch(err) {
        return next(new ServerError("Internal server error"));
    }
};

export const getVatById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    // Getting id from params and validating with zod
    const result = idSchema.safeParse(req.params);
    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { id } = result.data;

    try {
        const vats = await prisma.receiptVat.findUnique({ where: { id: id } });
        return res.status(200).json({ vats });
    } catch(err) {
        return next(new ServerError("Internal server error"));
    }
};