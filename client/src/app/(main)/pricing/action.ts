'use server';
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SubscriptionType } from "@/app/types/subscription";

export const upgradeSubscription = async (subscriptionType: SubscriptionType) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        console.log(subscriptionType)

        const response = await fetch("http://localhost:5001/api/subscription/change-plan", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            body: JSON.stringify({subscriptionType}),
        });

        // If response is not ok, return error message from server or a default one.
        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || "Invalid or expired session token" };
        }

        const data = await response.json();
        revalidatePath('/pricing'); 
        return data;
    } catch(error) {
        console.error(error);
    }
};