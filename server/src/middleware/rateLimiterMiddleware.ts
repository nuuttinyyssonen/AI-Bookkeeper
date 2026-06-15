import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";

export const rateLimiterMiddleware = (limiter: RateLimiterRedis, keyPrefix: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `${keyPrefix}:${(req as any).user?.id || req.ip}`;
      await limiter.consume(key);
      return next();
    } catch (rejRes: any) {
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