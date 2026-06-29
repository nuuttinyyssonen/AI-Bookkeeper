'use server';
import { initialStateEmail, EmailInput } from "@/app/types/FormTypes";
import { FormState } from "@/app/types/FormTypes";
import { emailSchema } from "@/schemas/auth.schema";

export default async function signupAction( _prevState: FormState<EmailInput>, formData: FormData) {

    const result = emailSchema.safeParse({
        email: formData.get("email"),
    });

    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const { email } = result.data;

    try {
        const response = await fetch("http://localhost:5001/api/auth/password-reset/send-email", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email
            })
        });

        if (response.status === 429) {
            const data = await response.json();
            return { ...initialStateEmail, error: data.message };
        }

        if (!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Invalid Credentials" };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return { error: "Something went wrong. Please try again." };
    }
};