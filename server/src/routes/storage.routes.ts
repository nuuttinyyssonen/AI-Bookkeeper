import { Router } from "express";
import { uploadFile, deleteFile, downloadFile } from "../controllers/storage.controller";
import { upload } from "../services/multer.service";
import { authMiddleware } from "../middleware/authentication";
import { uploadRateLimiterMiddleware } from "../middleware/rateLimiterMiddleware";
import multer from "multer";
import { ValidationError } from "../utils/error";

const storageRouter = Router();


storageRouter.post('/', authMiddleware, (req, res, next) => {
    upload.array("files")(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return next(new ValidationError("File too large. Maximum size is 10MB"));
        }
        if (err) return next(err);
        next();
    });
}, uploadFile);


storageRouter.get('/:id', authMiddleware, uploadRateLimiterMiddleware, downloadFile);
storageRouter.delete('/:id', authMiddleware, uploadRateLimiterMiddleware, deleteFile);

export default storageRouter;