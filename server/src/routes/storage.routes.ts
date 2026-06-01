import { Router } from "express";
import { uploadFile, deleteFile } from "../controllers/storage.controller";
import multer from "multer";
import { ValidationError } from "../utils/error";

const storageRouter = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png", 
            "image/webp",
            "application/pdf"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ValidationError("File type not supported. Only JPEG, PNG, WEBP and PDF are allowed"));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

storageRouter.post('/', upload.array("files"), uploadFile);
storageRouter.delete('/', deleteFile);

export default storageRouter;