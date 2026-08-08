"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.signupController = void 0;
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const supabase_1 = require("../lib/supabase");
const error_1 = require("../utils/error");
const auth_schema_1 = require("../schemas/auth.schema");
const id_schema_1 = require("../schemas/id.schema");
const error_2 = require("../utils/error");
/**
 * Registers a new user: creates the auth user in Supabase, hashes the password
 * and creates the corresponding user record in the database.
 * @param {Request} req.body - Signup data (email, password, first/last name, phonenumber, business_id)
 * @returns {201} Created user's id, email, first_name and last_name
 * @throws {ValidationError} 400 - If request body fails validation
 * @throws {ConflictError} 409 - If email is already in use
 * @throws {ServerError} 500 - If Supabase or database user creation fails
 */
const signupController = async (req, res, next) => {
    // Getting user's data from request body
    // Validation with zod schema
    const result = auth_schema_1.signupSchema.safeParse(req.body);
    if (!result.success) {
        return next(new error_1.ValidationError(result.error.issues[0].message));
    }
    const { email, password, first_name, last_name, phonenumber, business_id } = result.data;
    // Querying user to see if it already exists
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        const err = new error_1.ConflictError("Email is already in use");
        return next(err);
    }
    // Password hashing
    const saltRounds = 10;
    const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
    // Creating user in Supabase Auth
    const { data: supabaseData, error: supabaseError } = await supabase_1.supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });
    if (supabaseError || !supabaseData.user) {
        return res.status(500).json({ error: "Failed to create user in Supabase" });
    }
    // Creating user in database
    try {
        const newUser = await prisma_1.prisma.user.create({
            data: {
                email,
                password: passwordHash,
                first_name,
                last_name,
                phonenumber,
                supabase_id: supabaseData.user.id,
                business_id
            }
        });
        return res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name
        });
    }
    catch (error) {
        // If Prisma fails, delete user from supabase
        await supabase_1.supabaseAdmin.auth.admin.deleteUser(supabaseData.user.id);
        const err = new error_1.ServerError("Internal Server Error");
        return next(err);
    }
};
exports.signupController = signupController;
/**
 * Deletes a user by id.
 * @param {Request} req.body - User ID
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If user ID fails validation
 * @throws {Error} 500 - If database delete fails
 */
const deleteUser = async (req, res, next) => {
    // Validation with zod schema
    const result = id_schema_1.idSchema.safeParse(req.body);
    if (!result.success) {
        return next(new error_1.ValidationError(result.error.issues[0].message));
    }
    const { id } = result.data;
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: id } });
        if (!user) {
            return next(new error_2.NotFoundError("User was not found"));
        }
        // Delete supabase auth user before deleting user
        if (user.supabase_id) {
            const { error } = await supabase_1.supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
            if (error) {
                return next(new error_1.ServerError("Failed to delete user. Try again"));
            }
        }
        // Delete user from database
        await prisma_1.prisma.user.delete({ where: { id: id } });
        res.json({ message: 'User deleted' });
    }
    catch (error) {
        return next(error);
    }
};
exports.deleteUser = deleteUser;
