"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storage_controller_1 = require("../controllers/storage.controller");
const rateLimiter_1 = require("../utils/rateLimiter");
const demoMiddleware_1 = require("../middleware/demoMiddleware");
// Router
const storageRouter = (0, express_1.Router)();
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
storageRouter.get('/:id', demoMiddleware_1.demoMiddleware, rateLimiter_1.rateLimiters.heavyRead("storage_download"), storage_controller_1.downloadFile);
// storageRouter.delete('/:id', authMiddleware, rateLimiters.standard("storage_delete"), deleteFile);
// storageRouter.get('/fileUrl/:id', authMiddleware, rateLimiters.read("file_url"), getFileUrl);
exports.default = storageRouter;
