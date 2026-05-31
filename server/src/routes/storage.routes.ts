import { Router } from "express";
import { uploadFile, deleteFile } from "../controllers/storage.controller";
import multer from "multer";

const storageRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

storageRouter.post('/', upload.array("files"),uploadFile);

export default storageRouter;