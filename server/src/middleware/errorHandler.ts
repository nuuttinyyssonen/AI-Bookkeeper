import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ServerError, RateLimitError, ConflictError } from "../utils/error";
import logger from "../lib/logger";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    // Winston logger to log errors
    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        ip: req.ip
    });

    if(err instanceof AppError) {
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