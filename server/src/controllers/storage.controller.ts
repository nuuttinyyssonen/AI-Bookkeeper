import { deleteFileFromSupabase, downloadFileFromSupabase, uploadFileToSupabase } from "../services/supabase.service";
import { Request, Response, NextFunction } from "express";
import { AuthenticationError, NotFoundError, ServerError, ValidationError } from "../utils/error";
import { prisma } from "../lib/prisma";
import { receiptQueue } from "../queues/queue";
import { randomUUID } from "crypto";
import { idSchema } from "../schemas/id.schema";

// Sanitizes file name by removing special characters and replacing them with underscores.
// Also adds a timestamp prefix to avoid name conflicts in storage.
const sanitizeFileName = (fileName: string): string => {
    const timestamp = Date.now();
    const sanitized = fileName
        .normalize("NFD")                       // Decompose special chars e.g. 'ä' -> 'a' + diacritic
        .replace(/[\u0300-\u036f]/g, "")        // Remove diacritic marks
        .replace(/[^a-zA-Z0-9.\-_]/g, "_")     // Replace invalid chars with underscore
        .replace(/\s+/g, "_");                  // Replace whitespace with underscore
    
    return `${timestamp}_${sanitized}`;
};

// Normalizes the structure of multer files to a flat array for easier processing, 
// regardless of whether the files were uploaded using single or multiple file fields.
const normalizeMulterFiles = (
    multerFiles?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }
): Express.Multer.File[] => {
    if (!multerFiles) return [];
    return Array.isArray(multerFiles)
        ? multerFiles
        : Object.values(multerFiles).flat();
};

/**
 * Uploads one or more files to Supabase Storage, saves document metadata to the
 * database and queues each document for receipt processing.
 * @param {Request} req.files - Uploaded files (multer, single or multiple fields)
 * @param {Request} req.body - Optional `receipt_type`, defaults to "EXPENSE"
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with the created document records
 * @throws {ValidationError} 400 - If no files were provided
 * @throws {ServerError} 500 - If upload, database save or queuing fails
 */
export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    const files = normalizeMulterFiles(req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] });
    const user = req.user;
    const receipt_type = req.body.receipt_type ?? "EXPENSE";
    const batchId = randomUUID();

    // Validate that at least one file was provided
    if (files.length === 0) {
        return next(new ValidationError("No files were found"));
    }

    try {
        // Upload all files concurrently and save metadata to database
        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                // Upload file to Supabase Storage with sanitized file name
                const uploadedFile = await uploadFileToSupabase(sanitizeFileName(file.originalname), file);

                try {
                    // Save file metadata to database
                    const document = await prisma.document.create({
                        data: {
                            document_name: uploadedFile.path,
                            user_id: user.id,
                            file_path: uploadedFile.path,
                            document_type: file.mimetype,
                            document_size: file.size,
                            upload_batch_id: batchId
                        }
                    });

                    // Add a small delay to ensure file is fully available in storage and DB transaction is committed
                    // This helps prevent race conditions where the worker tries to access the file before it's ready
                    setTimeout(async () => {
                        try {
                            await receiptQueue.add("process-receipt", {
                                documentId: document.id,
                                filePath: uploadedFile.path,
                                userId: user.id,
                                receipt_type
                            });
                        } catch (error) {
                            console.error("Failed to queue receipt processing job:", error);
                        }
                    }, 500);

                    return document;
                } catch (error) {
                    await deleteFileFromSupabase(uploadedFile.path);
                    throw error;
                }
            })
        );

        return res.status(200).json(uploadedFiles);

    } catch (error) {
        return next(new ServerError("Internal server error"));
    }
};

/**
 * Deletes a receipt's associated document: removes its VAT entries and receipt
 * record (if any), then deletes the file from Supabase Storage and the document record.
 * @param {Request} req.params - Receipt ID
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If receipt ID fails validation or file name is missing
 * @throws {NotFoundError} 404 - If document not found
 * @throws {AuthenticationError} 401 - If the document does not belong to the user
 * @throws {ServerError} 500 - If file or database deletion fails
 */
export const deleteFile = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    // Getting id from params and validating with zod
    const result = idSchema.safeParse(req.params);
    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { id } = result.data;

    const receipt = await prisma.receipt.findUnique({ where: { id, user_id: req.user.id } });
    const document = await prisma.document.findUnique({ where: { id: receipt?.document_id, user_id: req.user.id } });

    const fileName = document?.document_name

    // Validate that fileName is provided and is a string
    if (!fileName || typeof fileName !== "string") {
        return next(new ValidationError("File name is required"));
    }

    try {
        // Find document from database by file name
        const document = await prisma.document.findUnique({ where: { document_name: fileName, user_id: req.user.id } });

        if (!document) {
            return next(new NotFoundError("File not found"));
        }
        
        const receipt = await prisma.receipt.findFirst({ where: { document_id: document.id, user_id: req.user.id } });

        // Delete associated receipt vats and receipt (if any), then delete file
        if (receipt) {
            await prisma.receiptVat.deleteMany({ where: { receipt_id: receipt.id } });
            await prisma.receipt.delete({ where: { id: receipt.id } });
        }

        await deleteFileFromSupabase(document.document_name);
        await prisma.document.delete({ where: { id: document.id } });
        res.status(200).json({ message: "File was deleted successfully" });
    } catch (error) {
        return next(new ServerError("Internal server error"));
    }
}

/**
 * Downloads the file associated with a receipt from Supabase Storage.
 * @param {Request} req.params - Receipt ID
 * @param {Request} req.user - User from auth middleware
 * @returns Sends the file buffer as an attachment
 * @throws {ValidationError} 400 - If receipt ID fails validation
 * @throws {NotFoundError} 404 - If receipt or document not found
 * @throws {AuthenticationError} 401 - If the document does not belong to the user
 * @throws {ServerError} 500 - If file download fails
 */
export const downloadFile = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    // Getting id from params and validating with zod
    const result = idSchema.safeParse(req.params);
    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { id } = result.data;

    try {
        const receipt = await prisma.receipt.findUnique({ where: { id, user_id: req.user.id } });
        if (!receipt) {
            return next(new NotFoundError("Receipt not found"));
        }

        const document = await prisma.document.findUnique({ where: { id: receipt.document_id, user_id: req.user.id} });
        if (!document) {
            return next(new NotFoundError("File not found"));
        }

        const fileBuffer = await downloadFileFromSupabase(document.document_name);
        const filename = document.document_name.split("/").pop() ?? document.document_name;

        res.setHeader("Content-Type", document.document_type || "application/octet-stream");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.send(fileBuffer);
    } catch (error) {
        return next(new ServerError("Internal server error"));
    }
}