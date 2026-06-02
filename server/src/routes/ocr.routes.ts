import { analyzeReceiptController } from "../controllers/ocr.controller";
import { Router } from "express";
import { upload } from "../services/multer.service";

const ocrRouter = Router();

ocrRouter.post("/", upload.array("files"), analyzeReceiptController);

export default ocrRouter;