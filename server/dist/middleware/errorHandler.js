"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_1 = require("../utils/error");
const logger_1 = __importDefault(require("../lib/logger"));
const errorHandler = (err, req, res, next) => {
    // Winston logger to log errors
    logger_1.default.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        ip: req.ip
    });
    // Handle specific error types with appropriate status codes and messages
    if (err instanceof error_1.AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }
    return res.status(500).json({
        status: 'error',
        message: "Internal server error"
    });
};
exports.errorHandler = errorHandler;
