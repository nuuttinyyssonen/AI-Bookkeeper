import { cookies } from "next/headers";

// Returns whether the current user has an active subscription. Does not redirect itself,
// since this is called from Route Handlers reached via fetch() (client and server side) where
// next/navigation's redirect() would just be silently followed by fetch instead of navigating the browser.
export const checkSubscription = async (): Promise<boolean> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch("http://localhost:5001/api/user/subscription", {
        headers: { Cookie: `token=${token}` },
    });

    if (!res.ok) return false;

    const { subscription } = await res.json();
    if (!subscription) return false;

    const isActive = subscription.subscription_status === 'ACTIVE' || subscription.subscription_status === 'TRIALING';
    const isCancelledButValid = subscription.subscription_status === 'CANCELLED' &&
        subscription.current_period_end !== null &&
        new Date(subscription.current_period_end) > new Date();

    return isActive || isCancelledButValid;
};