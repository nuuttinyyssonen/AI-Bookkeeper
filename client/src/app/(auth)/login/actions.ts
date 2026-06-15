'use server';

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { initialState, LoginInput } from "@/app/types/FormTypes";
import { FormState } from "@/app/types/FormTypes";
import { loginSchema } from "@/schemas/auth.schema";

export default async function loginAction(
    _prevState: FormState<LoginInput>, 
    formData: FormData
    ): Promise<FormState<LoginInput>> {

    // Getting email and password from forms.
    const result = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
    });

    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const { email, password } = result.data;

    try {
        // Sending login request to our backend API route.
        const response = await fetch("http://localhost:5001/api/auth/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password}),
        });

        if (response.status === 429) {
            const data = await response.json();
            return {
                ...initialState,
                error: data.message, // "You have exceeded the rate limit. Please try again later."
            };
        }

        // If response is not ok, return error message from server or a default one.
        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Invalid Credentials" };
        }

        const data = await response.json();
        
        // Setting token in cookies manually
        const cookieStore = await cookies();
        cookieStore.set("token", data.user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });
    } catch(error) {
        return { error: "Something went wrong. Please try again." };
    }
    redirect("/dashboard?message=logged-in");
}
