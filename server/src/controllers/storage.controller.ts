import { deleteFileFromSupabase, uploadFileToSupabase } from "../services/supabase.service";
import { Request, Response, NextFunction } from "express";
import { AuthenticationError, NotFoundError, ServerError, ValidationError } from "../utils/error";
import { prisma } from "../lib/prisma";
import { receiptQueue } from "../queues/queue";

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

const normalizeMulterFiles = (
    multerFiles?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }
): Express.Multer.File[] => {
    if (!multerFiles) return [];
    return Array.isArray(multerFiles)
        ? multerFiles
        : Object.values(multerFiles).flat();
};

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    const files = normalizeMulterFiles(req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] });
    const user = req.user;

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
                            document_size: file.size
                        }
                    });

                    // Add a job to the receipt processing queue for this document
                    await receiptQueue.add("process-receipt", {
                        documentId: document.id,
                        filePath: uploadedFile.path,
                        userId: user.id
                    });

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

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    const { fileName } = req.body ?? {};

    // Validate that fileName is provided and is a string
    if (!fileName || typeof fileName !== "string") {
        return next(new ValidationError("File name is required"));
    }

    try {
        // Find document from database by file name
        const document = await prisma.document.findUnique({ where: { document_name: fileName } });

        if (!document) {
            return next(new NotFoundError("File not found"));
        }

        // Ensure user can only delete their own files
        if (document.user_id !== req.user.id) {
            return next(new AuthenticationError("Unauthorized"));
        }

        // Delete file from Supabase Storage and remove metadata from database
        await deleteFileFromSupabase(document?.document_name);
        await prisma.document.delete({ where: { id: document.id } });
        res.status(200).json({ message: "File was deleted successfully" });
    } catch (error) {
        return next(new ServerError("Internal server error"));
    }
}
