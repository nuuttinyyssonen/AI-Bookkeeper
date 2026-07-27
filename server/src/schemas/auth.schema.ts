import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(5, "Password must be at least 5 characters")
});

export const signupSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    phonenumber: z.string().min(7, "Phone number is too short").max(15, "Phone number is too long"),
    business_id: z.string().regex(/^\d{7}-\d$/, "Business ID must be in format 1234567-8")
});

export const emailSchema = z.object({
    email: z.email("Invalid email"),
    platform: z.enum(["web", "mobile"]).optional()
});

export const passwordSchema = z.object({
    password: z.string().min(5).max(40, "Password must be at least 40 characters")
});