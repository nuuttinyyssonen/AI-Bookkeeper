import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError, ServerError, ValidationError } from '../utils/error';
import { idSchema, batchIdSchema } from '../schemas/id.schema';
import { categorySchema, isDeductibleSchema } from '../schemas/receipt.schema';
import { CategoryType } from "@prisma/client";

export const getAllReceiptsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        // Count pending and processing documents for the user to determine if there are any documents in those states
        const pending_document_count = await prisma.document.count({
            where: {
                user_id: user.id,
                status: "PENDING"
            },
        });

        const processing_document_count = await prisma.document.count({
            where: {
                user_id: user.id,
                status: "PROCESSING"
            }
        });

        const is_documents_processing = processing_document_count > 0;
        const is_documents_pending = pending_document_count > 0;

        // Fetch all receipts for the user, including related VAT and category information
        const receipts = await prisma.receipt.findMany({
            where: {
                user_id: user.id
            },
            include: {
                receiptVats: true,
                category: {
                select: { label: true }
            }
            }
        });

        return res.status(200).json({ receipts, is_documents_pending, is_documents_processing });
    } catch (err) {
        next(new ServerError("Internal server error"));
    }
};

export const getReceiptById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    // Getting id from params and validating with zod
    const result = idSchema.safeParse(req.params);
    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { id } = result.data;

    try {
        const receipt = await prisma.receipt.findUnique({ where: { id, user_id: req.user.id }, include: { receiptVats: true } });
        if(!receipt) {
            return next(new NotFoundError("Resource not found"));
        }

        return res.status(200).json({ receipt });
    } catch (err) {
        return next(new ServerError("Internal server error"));
    }
};

export const getReceiptStatus = async(req: Request<{batchId: string}>, res: Response, next: NextFunction) => {
    const user = req.user;

    // Getting batch ID and validating with zod.
    const result = batchIdSchema.safeParse(req.params);
    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { batchId } = result.data;

    try {
        // Count documents in different statuses for the given batch ID to provide an overview of the processing status
        const pending_documents = await prisma.document.count({
            where: { 
                user_id: user.id,
                status: "PENDING",
                upload_batch_id: batchId
            }
        });

        const completed_documents = await prisma.document.count({
            where: {
                user_id: user.id,
                status: "COMPLETED",
                upload_batch_id: batchId
            }
        });

        const processing_documents = await prisma.document.count({
            where: {
                user_id: user.id,
                status: "PROCESSING",
                upload_batch_id: batchId
            }
        });

        const total = await prisma.document.count({
            where: {
                user_id: user.id,
                upload_batch_id: batchId
            }
        });

        return res.status(200).json({ pending_documents, completed_documents, total, processing_documents });
    } catch(error) {
        return next(new ServerError("Internal server error"));
    }  
};


export const changeReceiptCategory = async(req: Request<{id: string}>, res: Response, next: NextFunction) => {
    // Getting category from req.body and id from params and validating with zod
    const cateogryResult = categorySchema.safeParse(req.body);
    const idResult = idSchema.safeParse(req.params);

    if(!cateogryResult.success) {
        return next(new ValidationError(cateogryResult.error.issues[0].message));
    }

    if(!idResult.success) {
        return next(new ValidationError(idResult.error.issues[0].message));
    }

    const { category } = cateogryResult.data;
    const { id } = idResult.data;

    try {
        await prisma.receipt.update({
            where: { id },
            data: {
                category: {
                    connect: { type: category as CategoryType }
                }
            }
        });
        return res.status(200).json({ message: "Category updated" });
    } catch (err) {
        return next(new ServerError("Internal server error"));
    }
};

export const changeReceiptDeductible = async(req: Request<{id: string}>, res: Response, next: NextFunction) => {
    // Getting category from req.body and id from params and validating with zod
    const deductibleResult = isDeductibleSchema.safeParse(req.body);
    const idResult = idSchema.safeParse(req.params);

    if (!deductibleResult.success) {
        return next(new ValidationError(deductibleResult.error.issues[0].message));
    }
    if (!idResult.success) {
        return next(new ValidationError(idResult.error.issues[0].message));
    }

    const { isDeductible } = deductibleResult.data;
    const { id } = idResult.data;

    try {
        await prisma.receipt.update({
            where: { id },
            data: {
                is_deductible: isDeductible
            }
        });
        return res.status(200).json({ message: "is_deductible updated" });
    } catch (err) {
        return next(new ServerError("Internal server error"));
    }
};