"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = __importDefault(require("../lib/logger"));
// Middleware to log incoming HTTP requests using Winston
const requestLogger = (req, res, next) => {
    const start = Date.now();
    // Log incoming request details
    res.on("finish", () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        logger_1.default.info({
            method: req.method,
            url: req.url,
            status,
            duration: `${duration}ms`,
            ip: req.ip
        });
    });
    next();
};
exports.requestLogger = requestLogger;
