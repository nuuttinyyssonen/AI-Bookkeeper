import multer from "multer";
import path from "path";
import { ValidationError } from "../utils/error";

export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png", 
            "image/webp",
            "application/pdf"
        ];

        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
        const fileExtension = file.originalname 
            ? path.extname(file.originalname).toLowerCase()
            : '';
        // Filter out files without a name
        if (!file.originalname || file.originalname === 'undefined') {
            return cb(null, false);
        }

        if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new ValidationError("File type not supported. Only JPEG, PNG, WEBP and PDF are allowed"));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});