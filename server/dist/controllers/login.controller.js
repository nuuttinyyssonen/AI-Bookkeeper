"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const prisma_1 = require("../lib/prisma");
const supabase_1 = require("../lib/supabase");
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_1 = require("../utils/error");
const auth_schema_1 = require("../schemas/auth.schema");
const error_2 = require("../utils/error");
/**
 * Authenticates a user with email and password.
 * Validates credentials against the database and signs in via Supabase to obtain a JWT.
 * @param req.body.email - User's email address
 * @param req.body.password - User's password
 * @returns 200 with user object containing JWT token and profile fields
 * @throws {ValidationError} 400 - If email or password fails validation
 * @throws {ConflictError} 409 - If email or password is incorrect
 * @throws {AuthenticationError} 401 - If Supabase authentication fails
 */
const loginController = async (req, res, next) => {
    // Getting user's email and password from the request with using zod schema.
    const result = auth_schema_1.loginSchema.safeParse(req.body);
    if (!result.success) {
        return next(new error_2.ValidationError(result.error.issues[0].message));
    }
    const { email, password } = result.data;
    // Finding user from database
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            email: email
        }
    });
    // Checking is provided password matches with user's password in database
    const passwordCorrect = user ? await bcrypt_1.default.compare(password, user.password) : false;
    if (!(passwordCorrect && user)) {
        const err = new error_1.ConflictError("Password or email is not correct");
        return next(err);
    }
    // Logging in to Supabase and getting session + JWT token
    const { data, error } = await supabase_1.supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error || !data.session) {
        const err = new error_1.AuthenticationError("Authentication error");
        return next(err);
    }
    return res.status(200)
        .json({
        user: {
            token: data.session.access_token,
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phonenumber: user.phonenumber
        }
    });
};
exports.loginController = loginController;
