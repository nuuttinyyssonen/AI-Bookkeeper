import { Router } from "express";
import { uploadFile, deleteFile } from "../controllers/storage.controller";
import { upload } from "../services/multer.service";
import { authMiddleware } from "../middleware/authentication";
import { uploadRateLimiterMiddleware } from "../middleware/rateLimiterMiddleware";

const storageRouter = Router();


storageRouter.post('/', authMiddleware, uploadRateLimiterMiddleware, upload.array("files"), uploadFile);
storageRouter.delete('/', authMiddleware, uploadRateLimiterMiddleware, deleteFile);

export default storageRouter;