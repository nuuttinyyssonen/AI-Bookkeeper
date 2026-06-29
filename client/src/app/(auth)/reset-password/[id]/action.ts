'use server';
import { intialStatePassword, PasswordInput } from "@/app/types/FormTypes";
import { FormState } from "@/app/types/FormTypes";
import { redirect } from "next/navigation";
import { passwordSchema } from "@/schemas/auth.schema";

export default async function resetPassword( _prevState: FormState<PasswordInput>, formData: FormData) {

    const id = formData.get("id");
    const result = passwordSchema.safeParse({
        password: formData.get("password"),
        passwordRepeat: formData.get("passwordRepeat"),
    });

    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const { password, passwordRepeat } = result.data;

    if (password !== passwordRepeat) {
        return { error: "Passwords do not match" };
    }

    try {
        const response = await fetch(`http://localhost:5001/api/auth/reset-password/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password
            })
        });

        if (response.status === 429) {
            const data = await response.json();
            return { ...intialStatePassword, error: data.message };
        }

        if (!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Invalid Credentials" };
        }

    } catch (error) {
        return { error: "Something went wrong. Please try again." };
    }
    return redirect("/login?message=password-reset");
};