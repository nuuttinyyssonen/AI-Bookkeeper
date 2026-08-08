"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiters = void 0;
const redis_1 = __importDefault(require("../lib/redis"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const rateLimiterMiddleware_1 = require("../middleware/rateLimiterMiddleware");
const createRateLimiter = ({ keyPrefix, points, duration = 60, blockDuration }) => new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redis_1.default,
    keyPrefix,
    points,
    duration,
    ...(blockDuration && { blockDuration }),
});
// Presets — built from the factory, but named for intent
exports.rateLimiters = {
    read: (key) => (0, rateLimiterMiddleware_1.rateLimiterMiddleware)(createRateLimiter({ keyPrefix: key, points: 300 }), key),
    standard: (key) => (0, rateLimiterMiddleware_1.rateLimiterMiddleware)(createRateLimiter({ keyPrefix: key, points: 100 }), key),
    heavyRead: (key) => (0, rateLimiterMiddleware_1.rateLimiterMiddleware)(createRateLimiter({ keyPrefix: key, points: 30 }), key),
    write: (key) => (0, rateLimiterMiddleware_1.rateLimiterMiddleware)(createRateLimiter({ keyPrefix: key, points: 30, blockDuration: 120 }), key),
    upload: (key) => (0, rateLimiterMiddleware_1.rateLimiterMiddleware)(createRateLimiter({ keyPrefix: key, points: 10, blockDuration: 60 }), key),
    sensitive: (key) => (0, rateLimiterMiddleware_1.rateLimiterMiddleware)(createRateLimiter({ keyPrefix: key, points: 5, blockDuration: 300 }), key),
};
