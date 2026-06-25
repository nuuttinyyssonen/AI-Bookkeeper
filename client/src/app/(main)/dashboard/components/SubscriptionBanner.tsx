import Link from "next/link";

interface Subscription {
    subscription_type: 'BASIC' | 'PREMIUM';
    subscription_status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE';
    current_period_end: string;
}

interface SubscriptionBannerProps {
    subscription: Subscription;
}

export default function SubscriptionBanner({ subscription }: SubscriptionBannerProps) {
    if (!subscription) {
        return (
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-800">
                    You don't have an active subscription.
                </p>
                <Link
                    href="/pricing"
                    className="text-sm font-medium text-amber-800 underline hover:text-amber-900"
                >
                    Subscribe now
                </Link>
            </div>
        );
    }

    if (subscription.subscription_status === 'PAST_DUE') {
        return (
            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-800">
                    Your payment failed. Update your payment method to keep access.
                </p>
                <Link
                    href="/billing"
                    className="text-sm font-medium text-red-800 underline hover:text-red-900"
                >
                    Update payment
                </Link>
            </div>
        );
    }

    if (subscription.subscription_status === 'CANCELLED') {
        const periodEnd = new Date(subscription.current_period_end).toLocaleDateString('fi-FI');
        return (
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-800">
                    Your subscription is cancelled. Access until {periodEnd}.
                </p>
                <Link
                    href="/pricing"
                    className="text-sm font-medium text-amber-800 underline hover:text-amber-900"
                >
                    Reactivate
                </Link>
            </div>
        );
    }

    if (subscription.subscription_type === 'BASIC') {
        return (
            <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50 px-4 py-3">
                <p className="text-sm text-teal-800">
                    You're on the <span className="font-medium">Basic</span> plan.
                </p>
                <Link
                    href="/pricing"
                    className="text-sm font-medium text-teal-800 underline hover:text-teal-900"
                >
                    Upgrade to Premium
                </Link>
            </div>
        );
    }

    if (subscription.subscription_type === 'PREMIUM') {
        return (
            <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50 px-4 py-3">
                <p className="text-sm text-teal-800">
                    You're on the <span className="font-medium">Premium</span> plan.
                </p>
                <Link
                    href="/pricing"
                    className="text-sm font-medium text-teal-800 underline hover:text-teal-900"
                >
                    View Plans
                </Link>
            </div>
        );
    }

    if (subscription.subscription_type === 'BASIC_YEARLY') {
        return (
            <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50 px-4 py-3">
                <p className="text-sm text-teal-800">
                    You're on the <span className="font-medium">Basic yearly</span> plan.
                </p>
                <Link
                    href="/pricing"
                    className="text-sm font-medium text-teal-800 underline hover:text-teal-900"
                >
                    Upgrade to Premium
                </Link>
            </div>
        );
    }

    if (subscription.subscription_type === 'PREMIUM_YEARLY') {
        return (
            <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50 px-4 py-3">
                <p className="text-sm text-teal-800">
                    You're on the <span className="font-medium">Premium yearly</span> plan.
                </p>
                <Link
                    href="/pricing"
                    className="text-sm font-medium text-teal-800 underline hover:text-teal-900"
                >
                    View Plans
                </Link>
            </div>
        );
    }

    return null;
}