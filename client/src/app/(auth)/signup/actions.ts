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

    if(!email || !password || !passwordRepeat || !lastName || !firstName || !phonenumber) {
        return { error: "All fields are required" };
    }

    if(password !== passwordRepeat) {
        return { error: "Passwords do not match" };
    }

    try {
        const response = await fetch("http://localhost:3001/api/auth/signup", {
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

        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Invalid Credentials" };
        }

        const data = await response.json();
        console.log(data);
    } catch(error) {
        return { error: "Something went wrong. Please try again." }
    }

    redirect("/login");
};
