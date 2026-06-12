import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(5, "Password must be at least 5 characters")
});

export const signupSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    passwordRepeat: z.string().min(5, "Password must be at least 5 characters"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    phonenumber: z.string().min(7, "Phone number is too short").max(15, "Phone number is too long")
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;