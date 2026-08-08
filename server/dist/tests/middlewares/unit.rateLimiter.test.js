"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rateLimiterMiddleware_1 = require("../../middleware/rateLimiterMiddleware");
const mockConsume = jest.fn().mockResolvedValue(true);
jest.mock("../../utils/rateLimiter", () => ({
    rateLimiters: {
        standard: jest.fn(() => mockConsume),
    },
    createRateLimiter: jest.fn(() => ({
        consume: mockConsume,
    })),
}));
describe("Rate Limiter Middleware", () => {
    let req;
    let res;
    let next;
    let mockLimiter;
    beforeEach(() => {
        mockLimiter = { consume: jest.fn().mockResolvedValue(true) };
        req = { ip: "127.0.0.1" };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });
    it("Calls next if rate limit is not exceeded", async () => {
        const middleware = (0, rateLimiterMiddleware_1.rateLimiterMiddleware)(mockLimiter, "test");
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
    it("Returns 429 if rate limit is exceeded", async () => {
        mockLimiter.consume.mockRejectedValueOnce({ msBeforeNext: 5000 });
        const middleware = (0, rateLimiterMiddleware_1.rateLimiterMiddleware)(mockLimiter, "test");
        await middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(429);
        expect(next).not.toHaveBeenCalled();
    });
    it("Sets Retry-After header when rate limit is exceeded", async () => {
        mockLimiter.consume.mockRejectedValueOnce({ msBeforeNext: 5000 });
        const middleware = (0, rateLimiterMiddleware_1.rateLimiterMiddleware)(mockLimiter, "test");
        await middleware(req, res, next);
        expect(res.set).toHaveBeenCalledWith("Retry-After", "5");
    });
    it("Uses user ID as key if user is authenticated", async () => {
        req.user = { id: 1 };
        const middleware = (0, rateLimiterMiddleware_1.rateLimiterMiddleware)(mockLimiter, "test");
        await middleware(req, res, next);
        expect(mockLimiter.consume).toHaveBeenCalledWith("test:1");
    });
    it("Falls back to IP if user is not authenticated", async () => {
        const middleware = (0, rateLimiterMiddleware_1.rateLimiterMiddleware)(mockLimiter, "test");
        await middleware(req, res, next);
        expect(mockLimiter.consume).toHaveBeenCalledWith("test:127.0.0.1");
    });
});
