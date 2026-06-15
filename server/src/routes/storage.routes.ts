import { Router } from "express";
import { uploadFile, deleteFile, downloadFile } from "../controllers/storage.controller";
import { upload } from "../services/multer.service";
import { authMiddleware } from "../middleware/authentication";
import multer from "multer";
import { ValidationError } from "../utils/error";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const storageRouter = Router();

// Upload route with multer middleware and error handling for file size limit
storageRouter.post('/', authMiddleware, rateLimiters.upload("storage_upload"), (req, res, next) => {
    upload.array("files")(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return next(new ValidationError("File too large. Maximum size is 10MB"));
        }
        if (err) return next(err);
        next();
    });
}, uploadFile);

// Download and delete routes with authentication and rate limiting
storageRouter.get('/:id', authMiddleware, rateLimiters.heavyRead("storage_download"), downloadFile);
storageRouter.delete('/:id', authMiddleware, rateLimiters.standard("storage_delete"), deleteFile);

export default storageRouter;