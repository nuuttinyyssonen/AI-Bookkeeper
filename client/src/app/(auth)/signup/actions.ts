'use server';

import { SignupInput } from "@/app/types/FormTypes";
import { FormState } from "@/app/types/FormTypes";
import { redirect } from "next/navigation";

export default async function signupAction(
    _prevState: FormState<SignupInput>,
    formData: FormData
    ): Promise<FormState<SignupInput>> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordRepeat = formData.get("passwordRepeat") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phonenumber = formData.get("phonenumber") as string;

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
