import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError, ServerError } from '../utils/error';

export const getAllReceiptsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        const pending_document_count = await prisma.document.count({
            where: {
                user_id: user.id,
                status: "PENDING"
            }
        });

        const processing_document_count = await prisma.document.count({
            where: {
                user_id: user.id,
                status: "PROCESSING"
            }
        });

        const is_documents_processing = processing_document_count > 0;
        const is_documents_pending = pending_document_count > 0;

        const receipts = await prisma.receipt.findMany({
            where: {
                user_id: user.id
            },
            include: {
                receiptVats: true
            }
        });

        return res.status(200).json({ receipts, is_documents_pending, is_documents_processing });
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
    const { batchId } = req.params;

    if(!batchId) {
        return next(new NotFoundError("Resource not found"));
    }

    try {
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
