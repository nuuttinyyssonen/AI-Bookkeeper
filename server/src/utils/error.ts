export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Object.setPrototypeOf(this, AppError.prototype);
    };
};

export class ValidationError extends AppError {
    constructor(message: 'Validation error') {
        super(400, message);
        Object.setPrototypeOf(this, ValidationError.prototype);
    };
};

export class AuthenticationError extends AppError {
    constructor(message: 'Authentication error') {
        super(401, message);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    };
};

export class AuthorizationError extends AppError {
    constructor(message: 'Authorization error') {
        super(403, message);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(message: 'Resource not found') {
        super(404, message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    };
};


export class ConflictError extends AppError {
    constructor(message: string = 'Conflict') {
        super(409, message);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests') {
        super(429, message);
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}


export class ServerError extends AppError {
    constructor(message: string = 'Internal server error') {
        super(500, message);
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}
