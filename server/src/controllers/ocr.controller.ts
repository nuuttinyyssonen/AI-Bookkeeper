import { Request, Response, NextFunction } from "express";
import { analyzeReceipt } from "../services/ocr.service";
import { NotFoundError } from "../utils/error";
import { parseReceiptData } from "../services/openai.service";

export const analyzeReceiptController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return next(new NotFoundError("No file uploaded"));
        }

        const { fullText, confidence } = await analyzeReceipt(files[0].buffer);
        const parsedData = await parseReceiptData(fullText);
        return res.status(200).json({ parsedData });
    } catch (error) {
        return next(error);
    }
};

