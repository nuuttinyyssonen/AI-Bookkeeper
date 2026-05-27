'use server';

import { redirect } from "next/navigation";
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
        const response = await fetch("http://localhost:3001/api/auth/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password}),
        });

        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Invalid Credentials" };
        }

        const data = await response.json();
        console.log(data);
        // redirect("/main");
    } catch(error) {
        return { error: "Something went wrong. Please try again." };
    }
    return {
        data: { email, password },
        error: null,
        success: true,
    };
}
