import logger from "../lib/logger";
import { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

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