import { Router } from "express";
import { uploadFile, deleteFile, downloadFile } from "../controllers/storage.controller";
import { upload } from "../services/multer.service";
import { authMiddleware } from "../middleware/authentication";
import { uploadRateLimiterMiddleware } from "../middleware/rateLimiterMiddleware";

const storageRouter = Router();


storageRouter.post('/', authMiddleware, uploadRateLimiterMiddleware, upload.fields([
    { name: "files", maxCount: 10 },
    { name: "cameraFile", maxCount: 1 }
]), uploadFile);
storageRouter.get('/:id', authMiddleware, uploadRateLimiterMiddleware, downloadFile);
storageRouter.delete('/:id', authMiddleware, uploadRateLimiterMiddleware, deleteFile);

export default storageRouter;