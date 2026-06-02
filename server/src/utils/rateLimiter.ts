import redis from "../lib/redis";
import { RateLimiterRedis } from "rate-limiter-flexible";

// Standard rate limiter for general use
const standardRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  points: 100, // Number of points
  duration: 60, // Per second(s)
});

// Upload rate limiter for file uploads, allowing fewer requests due to higher resource usage
export const uploadRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  points: 10, // Number of points
  duration: 60, // Per second(s)
});