"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.RateLimitError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
    ;
}
exports.AppError = AppError;
;
class ValidationError extends AppError {
    constructor(message = 'Validation error') {
        super(400, message);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
    ;
}
exports.ValidationError = ValidationError;
;
class AuthenticationError extends AppError {
    constructor(message = 'Authentication error') {
        super(401, message);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
    ;
}
exports.AuthenticationError = AuthenticationError;
;
class AuthorizationError extends AppError {
    constructor(message = 'Authorization error') {
        super(403, message);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(404, message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    ;
}
exports.NotFoundError = NotFoundError;
;
class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(409, message);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
exports.ConflictError = ConflictError;
class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(429, message);
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}
exports.RateLimitError = RateLimitError;
class ServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(500, message);
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}
exports.ServerError = ServerError;
