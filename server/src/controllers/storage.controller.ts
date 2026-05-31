import { supabase } from "../lib/supabase";
import { uploadFileToSupabase } from "../services/supabase.service";
import { Request, Response, NextFunction } from "express";
import { ServerError, ValidationError } from "../utils/error";
import { prisma } from "../lib/prisma";

const sanitizeFileName = (fileName: string): string => {
    const timestamp = Date.now();
    const sanitized = fileName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_")
        .replace(/\s+/g, "_");
    
    return `${timestamp}_${sanitized}`;
};

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    if(!files || files.length == 0) {
        return next(new ValidationError("No files were found"));
    }

    try {
        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                const uploadedFile = await uploadFileToSupabase(sanitizeFileName(file.originalname), file);
                
                const document = await prisma.document.create({
                    data: {
                        document_name: uploadedFile.path,
                        user_id: 2,
                        file_path: uploadedFile.path,
                        document_type: file.mimetype,
                        document_size: file.size
                    }
                });

                return document;
            })
        );

        return res.status(200).json(uploadedFiles);

    } catch (error) {
        return next(new ServerError("Internal server error"));
    }
}

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {

}