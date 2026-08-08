"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subscription_1 = require("../../middleware/subscription");
const prisma_1 = require("../../lib/prisma");
jest.mock("../../lib/prisma", () => ({
    prisma: {
        subscription: {
            findUnique: jest.fn()
        }
    }
}));
describe("Subscription Middleware", () => {
    let req;
    let res;
    let next;
    const findUniqueMock = prisma_1.prisma.subscription.findUnique;
    beforeEach(() => {
        req = { user: { id: "user-1" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });
    it("Calls next with error if no subscription is found", async () => {
        findUniqueMock.mockResolvedValue(null);
        await (0, subscription_1.requireSubscription)(req, res, next);
        expect(findUniqueMock).toHaveBeenCalledWith({ where: { user_id: "user-1" } });
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: "Subscription not found",
            statusCode: 403
        }));
    });
    it("Calls next without error if subscription is ACTIVE", async () => {
        findUniqueMock.mockResolvedValue({ subscription_status: "ACTIVE", current_period_end: null });
        await (0, subscription_1.requireSubscription)(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });
    it("Calls next without error if subscription is TRIALING", async () => {
        findUniqueMock.mockResolvedValue({ subscription_status: "TRIALING", current_period_end: null });
        await (0, subscription_1.requireSubscription)(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });
    it("Calls next without error if subscription is CANCELLED but still within the paid period", async () => {
        const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        findUniqueMock.mockResolvedValue({ subscription_status: "CANCELLED", current_period_end: futureDate });
        await (0, subscription_1.requireSubscription)(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });
    it("Calls next with error if subscription is CANCELLED and the paid period has ended", async () => {
        const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        findUniqueMock.mockResolvedValue({ subscription_status: "CANCELLED", current_period_end: pastDate });
        await (0, subscription_1.requireSubscription)(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: "Subscription expired",
            statusCode: 403
        }));
    });
    it("Calls next with error if subscription is CANCELLED with no period end", async () => {
        findUniqueMock.mockResolvedValue({ subscription_status: "CANCELLED", current_period_end: null });
        await (0, subscription_1.requireSubscription)(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: "Subscription expired",
            statusCode: 403
        }));
    });
    it("Calls next with error if subscription is PAST_DUE", async () => {
        findUniqueMock.mockResolvedValue({ subscription_status: "PAST_DUE", current_period_end: null });
        await (0, subscription_1.requireSubscription)(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: "Subscription expired",
            statusCode: 403
        }));
    });
    it("Calls next with error if subscription is INCOMPLETE", async () => {
        findUniqueMock.mockResolvedValue({ subscription_status: "INCOMPLETE", current_period_end: null });
        await (0, subscription_1.requireSubscription)(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: "Subscription expired",
            statusCode: 403
        }));
    });
    it("Calls next with a server error if the database lookup throws", async () => {
        findUniqueMock.mockRejectedValue(new Error("Database connection lost"));
        await (0, subscription_1.requireSubscription)(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: "Failed to verify subscription",
            statusCode: 500
        }));
    });
});
