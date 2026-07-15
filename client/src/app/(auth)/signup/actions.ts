'use server';
import { initialStateSignup, SignupInput } from "@/app/types/FormTypes";
import { FormState } from "@/app/types/FormTypes";
import { redirect } from "next/navigation";
import { signupSchema } from "@/schemas/auth.schema";

export default async function signupAction(
    _prevState: FormState<SignupInput>,
    formData: FormData
): Promise<FormState<SignupInput>> {

    const result = signupSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        passwordRepeat: formData.get("passwordRepeat"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phonenumber: formData.get("phonenumber"),
        businessId: formData.get("businessId"),
        termsOfAgreement: formData.get("termsOfAgreement") === "on"
    });

    const selectedPlan = formData.get('selectedPlan') as string;

    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const { email, password, passwordRepeat, firstName, lastName, phonenumber, businessId, termsOfAgreement } = result.data;

    if(!termsOfAgreement) {
        console.log(termsOfAgreement);
        return { error: "Privacy policy and Terms of Service is not agreed" };
    }

    if (!email || !password || !passwordRepeat || !lastName || !firstName || !phonenumber || !businessId) {
        return { error: "All fields are required" };
    }

    if (password !== passwordRepeat) {
        return { error: "Passwords do not match" };
    }

    let user_id: string;
    let checkoutUrl: string | null = null;

    try {
        const response = await fetch("http://localhost:5001/api/auth/signup", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                phonenumber,
                business_id: businessId
            })
        });

        if (response.status === 429) {
            const data = await response.json();
            return { ...initialStateSignup, error: data.message };
        }

        if (!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Invalid Credentials" };
        }

        const data = await response.json();
        user_id = data.id;

        const checkoutRes = await fetch('http://localhost:5001/api/subscription/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscriptionType: selectedPlan, user_id }),
        });

        if (!checkoutRes.ok) {
            // Delete the user we just created since checkout failed
            await fetch(`http://localhost:5001/api/auth/delete/${user_id}`, {
                method: 'DELETE',
            });
            return { error: 'Failed to create checkout session' };
        }

        const { url } = await checkoutRes.json();
        checkoutUrl = url;

    } catch (error) {
        return { error: "Something went wrong. Please try again." };
    }

    if (checkoutUrl) {
        redirect(checkoutUrl);
    }

    redirect('/login?message=account-created');
}