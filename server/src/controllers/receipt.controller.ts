import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError, ServerError, ValidationError } from '../utils/error';
import { idSchema, batchIdSchema } from '../schemas/id.schema';
import { categorySchema, isDeductibleSchema, receiptQuerySchema, updateReceiptSchema, deductibilityPercentageSchema} from '../schemas/receipt.schema';
import { CategoryType, ReceiptType } from "@prisma/client";
import ExcelJS from 'exceljs';

/**
 * Retrieves a paginated, filterable list of the authenticated user's receipts.
 * @param {Request} req.user - User from auth middleware
 * @param {Request} req.query - Pagination, date range, search, category and type filters
 * @returns 200 with receipts, pagination info, expense/income totals and document processing flags
 * @throws {ValidationError} 400 - If query params fail validation
 * @throws {ServerError} 500 - If database queries fail
 */
export const getAllReceiptsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // Validate and parse query params
    const queryResult = receiptQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
        return next(new ValidationError(queryResult.error.issues[0].message));
    }

    const { page, limit, from, to, search, category, type } = queryResult.data;
    const skip = (page - 1) * limit;

    // Build dynamic where clause based on provided filters
    const where = {
        user_id: user.id,
        ...(type && { receipt_type: type as ReceiptType }),
        ...(search && { vendor_name: { contains: search, mode: 'insensitive' as const } }),
        ...(category && { category: { type: category as CategoryType } }),
        ...((from || to) && {
            receipt_date: {
                ...(from && { gte: new Date(from) }),
                ...(to && { lte: new Date(to) }),
            },
        }),
    };

    try {
        // Run all queries in parallel for performance
        const [receipts, total, expenseTotal, incomeTotal, pending_document_count, processing_document_count] = await Promise.all([
            prisma.receipt.findMany({
                where,
                include: {
                    receiptVats: true,
                    category: { select: { label: true } },
                },
                skip,
                take: limit,
                orderBy: { receipt_date: 'desc' },
            }),
            prisma.receipt.count({ where }),
            prisma.receipt.count({ where: { user_id: user.id, receipt_type: 'EXPENSE' } }),
            prisma.receipt.count({ where: { user_id: user.id, receipt_type: 'INCOME' } }),
            prisma.document.count({ where: { user_id: user.id, status: 'PENDING' } }),
            prisma.document.count({ where: { user_id: user.id, status: 'PROCESSING' } }),
        ]);

        return res.status(200).json({
            receipts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            expenseTotal,
            incomeTotal,
            is_documents_pending: pending_document_count > 0,
            is_documents_processing: processing_document_count > 0,
        });
    } catch (err) {
        next(new ServerError("Internal server error"));
    }
};

/**
 * Retrieves a single receipt belonging to the authenticated user, including its VAT entries.
 * @param {Request} req.params - Receipt ID
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with `{ receipt }`
 * @throws {ValidationError} 400 - If receipt ID fails validation
 * @throws {NotFoundError} 404 - If receipt not found or does not belong to user
 * @throws {ServerError} 500 - If database query fails
 */
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

/**
 * Gets the processing status overview for a batch of uploaded documents.
 * @param {Request} req.params - Upload batch ID
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with counts of pending, processing and completed documents, plus the batch total
 * @throws {ValidationError} 400 - If batch ID fails validation
 * @throws {ServerError} 500 - If database queries fail
 */
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


/**
 * Updates a receipt's vendor, amount, date and associated VAT entries.
 * @param {Request} req.params - Receipt ID
 * @param {Request} req.body - Updated vendor name, total amount, receipt date and VAT entries
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If receipt ID or body fails validation
 * @throws {ServerError} 500 - If database transaction fails
 */
export const updateReceipt = async(req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const idResult = idSchema.safeParse(req.params);
    const bodyResult = updateReceiptSchema.safeParse(req.body);

    if (!idResult.success) {
        return next(new ValidationError(idResult.error.issues[0].message));
    }
    if (!bodyResult.success) {
        return next(new ValidationError(bodyResult.error.issues[0].message));
    }

    const { id } = idResult.data;
    const { vendor_name, total_amount, receipt_date, vats } = bodyResult.data;

    try {
        await prisma.$transaction(async (tx) => {
            await tx.receipt.update({
                where: { id, user_id: req.user.id },
                data: { vendor_name, total_amount, receipt_date: new Date(receipt_date) },
            });

            if (vats && vats.length > 0) {
                await Promise.all(vats.map(vat =>
                    tx.receiptVat.update({
                        where: { id: vat.id },
                        data: { rate: vat.rate, net_amount: vat.net_amount, vat_amount: vat.vat_amount, total: vat.total },
                    })
                ));
            }
        });

        return res.status(200).json({ message: "Receipt updated" });
    } catch (err) {
        return next(new ServerError("Internal server error"));
    }
};

/**
 * Changes the category assigned to a receipt.
 * @param {Request} req.params - Receipt ID
 * @param {Request} req.body - New category type
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If category or receipt ID fails validation
 * @throws {ServerError} 500 - If database update fails
 */
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

/**
 * Changes whether a receipt is marked as tax deductible.
 * @param {Request} req.params - Receipt ID
 * @param {Request} req.body - New `isDeductible` boolean value
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If body or receipt ID fails validation
 * @throws {ServerError} 500 - If database update fails
 */
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

/**
 * Changes the VAT deductibility percentage applied to a receipt.
 * @param {Request} req.params - Receipt ID
 * @param {Request} req.body - New deductibility percentage value
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If body or receipt ID fails validation
 * @throws {ServerError} 500 - If database update fails
 */
export const changeReceiptDeductibilityPercentage = async(req: Request<{id: string}>, res: Response, next: NextFunction) => {
    // Getting category from req.body and id from params and validating with zod
    const deductibleResult = deductibilityPercentageSchema.safeParse(req.body);
    const idResult = idSchema.safeParse(req.params);

    if (!deductibleResult.success) {
        return next(new ValidationError(deductibleResult.error.issues[0].message));
    }
    if (!idResult.success) {
        return next(new ValidationError(idResult.error.issues[0].message));
    }

    const { deductibilityPercentage } = deductibleResult.data;
    const { id } = idResult.data;

    try {
        await prisma.receipt.update({
            where: { id },
            data: {
                vat_deductibility_percentage: deductibilityPercentage
            }
        });
        return res.status(200).json({ message: "is_deductible updated" });
    } catch (err) {
        return next(new ServerError("Internal server error"));
    }
};

/**
 * Exports the authenticated user's filtered receipts as an Excel (.xlsx) file.
 * @param {Request} req.user - User from auth middleware
 * @param {Request} req.query - Date range, search, category and type filters
 * @returns Streams an .xlsx file as an attachment
 * @throws {ValidationError} 400 - If query params fail validation
 * @throws {ServerError} 500 - If database query or workbook generation fails
 */
export const exportReceiptsToExcel = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const queryResult = receiptQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
        return next(new ValidationError(queryResult.error.issues[0].message));
    }

    const { from, to, search, category, type } = queryResult.data;

    const where = {
        user_id: user.id,
        ...(type && { receipt_type: type as ReceiptType }),
        ...(search && { vendor_name: { contains: search, mode: 'insensitive' as const } }),
        ...(category && { category: { type: category as CategoryType } }),
        ...((from || to) && {
            receipt_date: {
                ...(from && { gte: new Date(from) }),
                ...(to && { lte: new Date(to) }),
            },
        }),
    };

    try {
        const receipts = await prisma.receipt.findMany({
            where,
            include: {
                receiptVats: true,
                category: { select: { label: true } },
            },
            orderBy: [{ receipt_date: 'desc' }, { created_at: 'desc' }],
        });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Receipts');

        // Header row
        sheet.columns = [
            { header: 'Date', key: 'date', width: 14 },
            { header: 'Vendor', key: 'vendor', width: 28 },
            { header: 'Category', key: 'category', width: 22 },
            { header: 'Type', key: 'type', width: 10 },
            { header: 'Net (€)', key: 'net', width: 12 },
            { header: 'VAT %', key: 'vat_rate', width: 10 },
            { header: 'VAT Amount (€)', key: 'vat_amount', width: 16 },
            { header: 'Total (€)', key: 'total', width: 12 },
            { header: 'Deductible', key: 'deductible', width: 12 },
        ];

        // Style header row
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE2E8F0' },
        };

        // Add rows
        for (const receipt of receipts) {
            const vat = receipt.receiptVats[0];
            sheet.addRow({
                date: new Date(receipt.receipt_date).toISOString().split('T')[0],
                vendor: receipt.vendor_name,
                category: receipt.category?.label ?? '',
                type: receipt.receipt_type,
                net: vat ? Number(vat.net_amount.toFixed(2)) : '',
                vat_rate: vat ? `${vat.rate}%` : '',
                vat_amount: vat ? Number(vat.vat_amount.toFixed(2)) : '',
                total: Number(receipt.total_amount.toFixed(2)),
                deductible: receipt.is_deductible ? 'Yes' : 'No',
            });
        }

        // Number formatting for currency columns
        ['net', 'vat_amount', 'total'].forEach((key) => {
            sheet.getColumn(key).numFmt = '#,##0.00';
        });

        const filename = `receipts-${type?.toLowerCase() ?? 'all'}-${Date.now()}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        return next(new ServerError("Internal server error"));
    }
};