"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("../../middleware/errorHandler");
const error_1 = require("../../utils/error");
describe("Error Handler Middleware", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });
    it("Handles ValidationError with 400", () => {
        const error = new error_1.ValidationError("Email is requried");
        (0, errorHandler_1.errorHandler)(error, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ "message": "Email is requried", "status": "error" });
    });
    it("Handles AuthenticationError with 401", () => {
        const error = new error_1.AuthenticationError("Authentication Error");
        (0, errorHandler_1.errorHandler)(error, req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ "message": "Authentication Error", "status": "error" });
    });
    it("Handles AuthorizationError with 403", () => {
        const error = new error_1.AuthorizationError("Authorization Error");
        (0, errorHandler_1.errorHandler)(error, req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ "message": "Authorization Error", "status": "error" });
    });
    it("Handles ConflictError with 409", () => {
        const error = new error_1.ConflictError("Email is already in use");
        (0, errorHandler_1.errorHandler)(error, req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ "message": "Email is already in use", "status": "error" });
    });
    it("Handles NotFoundError with 404", () => {
        const error = new error_1.NotFoundError("Resource not found");
        (0, errorHandler_1.errorHandler)(error, req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ "message": "Resource not found", "status": "error" });
    });
    it("Handles ServerError with 500", () => {
        const error = new error_1.ServerError("Internal server error");
        (0, errorHandler_1.errorHandler)(error, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ "message": "Internal server error", "status": "error" });
    });
    it("Handles RateLimitError with 429", () => {
        const error = new error_1.ServerError("Too many requests");
        (0, errorHandler_1.errorHandler)(error, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ "message": "Too many requests", "status": "error" });
    });
});
