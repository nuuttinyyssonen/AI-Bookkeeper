import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const checkSubscription = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch("http://localhost:5001/api/user/subscription", {
        headers: { Cookie: `token=${token}` },
    });

    if (!res.ok) redirect("/pricing?message=subscription_required");

    const { subscription } = await res.json();
    if (subscription.subscription_status !== 'ACTIVE' && subscription.subscription_status !== 'TRIALING') {
        redirect("/pricing?message=subscription_required");
    }
};