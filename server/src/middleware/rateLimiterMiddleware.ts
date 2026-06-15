import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";

// Middleware factory function to create a rate limiter middleware for Express routes
export const rateLimiterMiddleware = (limiter: RateLimiterRedis, keyPrefix: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use user ID as key if available, otherwise fallback to IP address
      const key = `${keyPrefix}:${(req as any).user?.id || req.ip}`;
      await limiter.consume(key);
      return next();
    } catch (rejRes: any) {
      // If the rate limit is exceeded, set the Retry-After header and return a 429 response
      const retryAfterSeconds = Math.ceil(rejRes.msBeforeNext / 1000);
      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        error: "TOO_MANY_REQUESTS",
        message: "You have exceeded the rate limit. Please try again later.",
        retryAfterSeconds,
      });
    }
  };
};