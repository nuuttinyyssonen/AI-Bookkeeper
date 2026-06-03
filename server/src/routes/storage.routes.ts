import { Router } from "express";
import { uploadFile, deleteFile } from "../controllers/storage.controller";
import { upload } from "../services/multer.service";
import { authMiddleware } from "../middleware/authentication";
import { uploadRateLimiterMiddleware } from "../middleware/rateLimiterMiddleware";

const storageRouter = Router();


storageRouter.post('/', authMiddleware, uploadRateLimiterMiddleware, upload.fields([
    { name: "files", maxCount: 10 },
    { name: "cameraFile", maxCount: 1 }
]), uploadFile);
storageRouter.delete('/:id', authMiddleware, uploadRateLimiterMiddleware, deleteFile);

export default storageRouter;