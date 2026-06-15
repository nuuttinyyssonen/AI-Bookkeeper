import { analyzeReceiptController } from "../controllers/ocr.controller";
import { Router } from "express";
import { upload } from "../services/multer.service";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const ocrRouter = Router();

// Route for analyzing receipt images, protected by multer middleware for handling file uploads
ocrRouter.post("/", upload.array("files"), rateLimiters.write("ocr"), analyzeReceiptController);

export default ocrRouter;