'use server';

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginInput } from "@/app/types/FormTypes";
import { FormState } from "@/app/types/FormTypes";

export default async function loginAction(
    _prevState: FormState<LoginInput>, 
    formData: FormData
    ): Promise<FormState<LoginInput>> {
    // Getting email and password from forms.
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // validating form fields
    if(!email || !password) {
        return { error: "Email and password are required" };
    }

    try {
        // Sending login request to our backend API route.
        const response = await fetch("http://localhost:3001/api/auth/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password}),
        });

        // If response is not ok, return error message from server or a default one.
        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Invalid Credentials" };
        }

        const data = await response.json();
        
        // Setting token in cookies manually
        const cookieStore = await cookies();
        cookieStore.set("token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });
    } catch(error) {
        return { error: "Something went wrong. Please try again." };
    }
    redirect("/dashboard");
}
