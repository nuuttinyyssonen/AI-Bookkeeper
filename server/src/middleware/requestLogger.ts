import logger from "../lib/logger";
import { Request, Response, NextFunction } from "express";

// Middleware to log incoming HTTP requests using Winston
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Log incoming request details
    res.on("finish", () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        logger.info({
            method: req.method,
            url: req.url,
            status,
            duration: `${duration}ms`,
            ip: req.ip
        });
    });

    next();
};