import { Request, Response, NextFunction } from "express";
import { uploadRateLimiter, standardRateLimiter } from "../utils/ratelimiter";
import redis from "../lib/redis";

// Middleware for standard rate limiting
export const  standardRateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = (req as any).user?.id || req.ip; // Use user ID if authenticated, otherwise use IP
        await standardRateLimiter.consume(key);
        return next();
    } catch (rejRes: any) {
        // Set Retry-After header to inform client when they can retry
        const retryAfterSeconds = Math.ceil(rejRes.msBeforeNext / 1000);
        res.set("Retry-After", String(retryAfterSeconds));
        return res.status(429).json({
        error: "RATE_LIMITED",
        retryAfterSeconds,
        });
    }
};

// Middleware for upload rate limiting
export const uploadRateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = (req as any).user?.id || req.ip; // Use user ID if authenticated, otherwise use IP
        await uploadRateLimiter.consume(key);
        return next();
    } catch (rejRes: any) {
        // Set Retry-After header to inform client when they can retry
        const retryAfterSeconds = Math.ceil(rejRes.msBeforeNext / 1000);
        res.set("Retry-After", String(retryAfterSeconds));
        return res.status(429).json({
        error: "UPLOAD_RATE_LIMITED",
        retryAfterSeconds,
        });
    }
};