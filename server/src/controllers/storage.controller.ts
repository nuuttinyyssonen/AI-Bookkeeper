import { supabase } from "../lib/supabase";
import { uploadFileToSupabase } from "../services/supabase.service";
import { Request, Response, NextFunction } from "express";
import { ServerError, ValidationError } from "../utils/error";
import { prisma } from "../lib/prisma";

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    if(!files || files.length == 0) {
        return next(new ValidationError("No files were found"));
    }

    try {
        const uploadedFile = await uploadFileToSupabase(files[0].originalname, files[0]);
        return res.status(200).send(uploadedFile);
    } catch (error) {
        return next(new ServerError("Internal server error"));
    }
}

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {

}