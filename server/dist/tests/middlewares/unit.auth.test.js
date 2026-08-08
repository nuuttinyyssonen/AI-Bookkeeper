"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../../middleware/authentication");
const supabase_1 = require("../../lib/supabase");
const prisma_1 = require("../../lib/prisma");
jest.mock("../../lib/supabase", () => ({
    supabase: {
        auth: {
            getUser: jest.fn()
        }
    },
    supabaseAdmin: {
        auth: {
            admin: {
                createUser: jest.fn(),
                deleteUser: jest.fn()
            }
        },
        storage: {
            from: jest.fn()
        }
    }
}));
jest.mock("../../lib/prisma", () => ({
    prisma: {
        user: {
            findUnique: jest.fn()
        }
    }
}));
describe("Auth Middleware", () => {
    let req;
    let res;
    let next;
    const getUserMock = supabase_1.supabase.auth.getUser;
    const findUniqueMock = prisma_1.prisma.user.findUnique;
    beforeEach(() => {
        req = { cookies: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });
    it("Calls next with error if token is missing", async () => {
        await (0, authentication_1.authMiddleware)(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: "Token is missing",
            statusCode: 401
        }));
        expect(getUserMock).not.toHaveBeenCalled();
        expect(findUniqueMock).not.toHaveBeenCalled();
    });
    it("Calls next with error if token is invalid", async () => {
        req.cookies = { token: "invalid-token" };
        getUserMock.mockResolvedValue({
            data: { user: null },
            error: new Error("Invalid token")
        });
        await (0, authentication_1.authMiddleware)(req, res, next);
        expect(getUserMock).toHaveBeenCalledWith("invalid-token");
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: "Token is invalid or expired",
            statusCode: 401
        }));
        expect(findUniqueMock).not.toHaveBeenCalled();
    });
    it("Calls next with error if database user is not found", async () => {
        req.cookies = { token: "valid-token" };
        getUserMock.mockResolvedValue({
            data: { user: { id: "supabase-uuid" } },
            error: null
        });
        findUniqueMock.mockResolvedValue(null);
        await (0, authentication_1.authMiddleware)(req, res, next);
        expect(findUniqueMock).toHaveBeenCalledWith({
            where: { supabase_id: "supabase-uuid" }
        });
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: "User not found",
            statusCode: 401
        }));
    });
    it("Attaches user to request and calls next if token is valid", async () => {
        const user = {
            id: 1,
            email: "test@test.com",
            password: "hashed-password",
            first_name: "Test",
            last_name: "User",
            phonenumber: "040123456",
            supabase_id: "supabase-uuid",
            business_id: "1111111-6"
        };
        req.cookies = { token: "valid-token" };
        getUserMock.mockResolvedValue({
            data: { user: { id: "supabase-uuid" } },
            error: null
        });
        findUniqueMock.mockResolvedValue(user);
        await (0, authentication_1.authMiddleware)(req, res, next);
        expect(getUserMock).toHaveBeenCalledWith("valid-token");
        expect(findUniqueMock).toHaveBeenCalledWith({
            where: { supabase_id: "supabase-uuid" }
        });
        expect(req.user).toEqual(user);
        expect(next).toHaveBeenCalledWith();
    });
    it("Calls next with error if authentication throws", async () => {
        req.cookies = { token: "valid-token" };
        getUserMock.mockRejectedValue(new Error("Supabase failed"));
        await (0, authentication_1.authMiddleware)(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: "Authentication failed",
            statusCode: 401
        }));
    });
});
