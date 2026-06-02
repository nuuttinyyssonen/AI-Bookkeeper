import { Request, Response, NextFunction } from "express";
import { standardRateLimiterMiddleware } from "../../middleware/rateLimiterMiddleware";

jest.mock("../../utils/rateLimiter", () => ({
    standardRateLimiter: jest.fn(() => ({
        consume: jest.fn().mockResolvedValue(true)
    })),
    uploadRateLimiter: {
        consume: jest.fn().mockResolvedValue(true)
    }
}));

describe("Rate Limiter Middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = { ip: "127.0.0.1" };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    it("Calls next if rate limit is not exceeded", async () => {
        const middleware = standardRateLimiterMiddleware("test");
        await middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("Returns 429 if rate limit is exceeded", async () => {
        const { standardRateLimiter: mockRateLimiter } = jest.requireMock("../../utils/rateLimiter");
        
        mockRateLimiter.mockImplementationOnce(() => ({
            consume: jest.fn().mockRejectedValue({ msBeforeNext: 5000 })
        }));

        const middleware = standardRateLimiterMiddleware("test");
        await middleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(429);
        expect(next).not.toHaveBeenCalled();
    });

    it("Sets Retry-After header when rate limit is exceeded", async () => {
        const { standardRateLimiter: mockRateLimiter } = jest.requireMock("../../utils/rateLimiter");
        mockRateLimiter.mockImplementationOnce(() => ({
            consume: jest.fn().mockRejectedValue({ msBeforeNext: 5000 })
        }));

        const middleware = standardRateLimiterMiddleware("test");
        await middleware(req as Request, res as Response, next);

        expect(res.set).toHaveBeenCalledWith("Retry-After", "5");
    });

    it("Uses user ID as key if user is authenticated", async () => {
        const { standardRateLimiter: mockRateLimiter } = jest.requireMock("../../utils/rateLimiter");
        const mockConsume = jest.fn().mockResolvedValue(true);
        mockRateLimiter.mockImplementationOnce(() => ({
            consume: mockConsume
        }));

        req.user = { id: 1 } as any;
        const middleware = standardRateLimiterMiddleware("test");
        await middleware(req as Request, res as Response, next);

        expect(mockConsume).toHaveBeenCalledWith("test:1");
    });
});