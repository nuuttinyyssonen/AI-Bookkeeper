"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterMiddleware = void 0;
// Middleware factory function to create a rate limiter middleware for Express routes
const rateLimiterMiddleware = (limiter, keyPrefix) => {
    return async (req, res, next) => {
        if (process.env.DISABLE_RATE_LIMIT === "true")
            return next();
        try {
            // Use user ID as key if available, otherwise fallback to IP address
            const key = `${keyPrefix}:${req.user?.id || req.ip}`;
            await limiter.consume(key);
            return next();
        }
        catch (rejRes) {
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
exports.rateLimiterMiddleware = rateLimiterMiddleware;
