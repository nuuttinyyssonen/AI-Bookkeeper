"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const error_1 = require("../utils/error");
// Multer configuration for handling file uploads with in-memory storage and file type validation
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        // Define allowed MIME types and file extensions for uploaded files
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf"
        ];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
        const fileExtension = file.originalname
            ? path_1.default.extname(file.originalname).toLowerCase()
            : '';
        // Filter out files without a name
        if (!file.originalname || file.originalname === 'undefined') {
            return cb(null, false);
        }
        // Validate file type based on mimetype or file extension
        if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        }
        else {
            cb(new error_1.ValidationError("File type not supported. Only JPEG, PNG, WEBP and PDF are allowed"));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});
