import { Router } from "express";
import { uploadFile, deleteFile, downloadFile, getFileUrl } from "../controllers/storage.controller";
import { upload } from "../services/multer.service";
import { authMiddleware } from "../middleware/authentication";
import multer from "multer";
import { ValidationError } from "../utils/error";
import { rateLimiters } from "../utils/rateLimiter";
import { requireSubscription } from "../middleware/subscription";
import { demoMiddleware } from "../middleware/demoMiddleware";

// Router
const storageRouter = Router();

// Upload route with multer middleware and error handling for file size limit
// storageRouter.post('/', authMiddleware, requireSubscription, rateLimiters.upload("storage_upload"), (req, res, next) => {
//     upload.array("files")(req, res, (err) => {
//         if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
//             return next(new ValidationError("File too large. Maximum size is 10MB"));
//         }
//         if (err) return next(err);
//         next();
//     });
// }, uploadFile);

// Download and delete routes with authentication and rate limiting
storageRouter.get('/:id', demoMiddleware, rateLimiters.heavyRead("storage_download"), downloadFile);
// storageRouter.delete('/:id', authMiddleware, rateLimiters.standard("storage_delete"), deleteFile);
// storageRouter.get('/fileUrl/:id', authMiddleware, rateLimiters.read("file_url"), getFileUrl);

export default storageRouter;