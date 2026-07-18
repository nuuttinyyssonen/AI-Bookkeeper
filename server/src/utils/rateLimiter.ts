import redis from "../lib/redis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { rateLimiterMiddleware } from "../middleware/rateLimiterMiddleware";

interface RateLimiterOptions {
  keyPrefix: string;
  points: number;
  duration?: number;      // seconds, defaults to 60
  blockDuration?: number; // seconds, optional
}

const createRateLimiter = ({ keyPrefix, points, duration = 60, blockDuration }: RateLimiterOptions) =>
  new RateLimiterRedis({
    storeClient: redis,
    keyPrefix,
    points,
    duration,
    ...(blockDuration && { blockDuration }),
});

// Presets — built from the factory, but named for intent
export const rateLimiters = {
    read:      (key: string) => rateLimiterMiddleware(createRateLimiter({ keyPrefix: key, points: 300 }), key),
    standard:  (key: string) => rateLimiterMiddleware(createRateLimiter({ keyPrefix: key, points: 100 }), key),
    heavyRead: (key: string) => rateLimiterMiddleware(createRateLimiter({ keyPrefix: key, points: 30 }), key),
    write:     (key: string) => rateLimiterMiddleware(createRateLimiter({ keyPrefix: key, points: 30, blockDuration: 120 }), key),
    upload:    (key: string) => rateLimiterMiddleware(createRateLimiter({ keyPrefix: key, points: 10, blockDuration: 60 }), key),
    sensitive: (key: string) => rateLimiterMiddleware(createRateLimiter({ keyPrefix: key, points: 5, blockDuration: 300 }), key),
};