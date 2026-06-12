'use server';

import { SignupInput } from "@/app/types/FormTypes";
import { FormState } from "@/app/types/FormTypes";
import { redirect } from "next/navigation";
import { signupSchema } from "@/schemas/auth.schema";

export default async function signupAction(
    _prevState: FormState<SignupInput>,
    formData: FormData
    ): Promise<FormState<SignupInput>> {
    
    // Zod validation
    const result = signupSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        passwordRepeat: formData.get("passwordRepeat"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phonenumber: formData.get("phonenumber")
    });

    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const { email, password, passwordRepeat, firstName, lastName, phonenumber } = result.data;

    // validating form fields
    if(!email || !password || !passwordRepeat || !lastName || !firstName || !phonenumber) {
        return { error: "All fields are required" };
    }

    // validating password match
    if(password !== passwordRepeat) {
        return { error: "Passwords do not match" };
    }

    // sending signup request to our backend API route.
    try {
        const response = await fetch("http://localhost:5001/api/auth/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                phonenumber
            })
        });

        // If response is not ok, return error message from server or a default one.
        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Invalid Credentials" };
        }
    } catch(error) {
        return { error: "Something went wrong. Please try again." }
    }

    // Redirecting to login page after successful signup
    redirect("/login?message=account-created");
};
