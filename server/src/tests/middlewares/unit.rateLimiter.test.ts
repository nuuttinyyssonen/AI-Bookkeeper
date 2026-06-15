import { Request, Response } from "express";
import { rateLimiterMiddleware } from "../../middleware/rateLimiterMiddleware";

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
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let mockLimiter: { consume: jest.Mock };

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
    const middleware = rateLimiterMiddleware(mockLimiter as any, "test");
    await middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("Returns 429 if rate limit is exceeded", async () => {
    mockLimiter.consume.mockRejectedValueOnce({ msBeforeNext: 5000 });
    const middleware = rateLimiterMiddleware(mockLimiter as any, "test");
    await middleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(next).not.toHaveBeenCalled();
  });

  it("Sets Retry-After header when rate limit is exceeded", async () => {
    mockLimiter.consume.mockRejectedValueOnce({ msBeforeNext: 5000 });
    const middleware = rateLimiterMiddleware(mockLimiter as any, "test");
    await middleware(req as Request, res as Response, next);
    expect(res.set).toHaveBeenCalledWith("Retry-After", "5");
  });

  it("Uses user ID as key if user is authenticated", async () => {
    req.user = { id: 1 } as any;
    const middleware = rateLimiterMiddleware(mockLimiter as any, "test");
    await middleware(req as Request, res as Response, next);
    expect(mockLimiter.consume).toHaveBeenCalledWith("test:1");
  });

  it("Falls back to IP if user is not authenticated", async () => {
    const middleware = rateLimiterMiddleware(mockLimiter as any, "test");
    await middleware(req as Request, res as Response, next);
    expect(mockLimiter.consume).toHaveBeenCalledWith("test:127.0.0.1");
  });
});