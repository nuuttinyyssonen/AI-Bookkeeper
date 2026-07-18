export const subscriptionType = {
    basic: 'BASIC',
    premium: 'PREMIUM',
    basicYearly: 'BASIC_YEARLY',
    premiumYearly: 'PREMIUM_YEARLY',
} as const;

export type SubscriptionType = typeof subscriptionType[keyof typeof subscriptionType];

export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE";

export type Subscription = {
    id: string;
    subscription_type: SubscriptionType;
    subscription_status: SubscriptionStatus;
    started_at: string;
    ended_at?: string | null;
    current_period_start?: string | null;
    current_period_end?: string | null;
    stripe_subscription_id: string;
    stripe_customer_id: string;
    stripe_price_id: string;
    cancel_at_period_end: boolean;
    user_id: string;
};

export type PaymentHistoryItem = {
    id: string;
    date: string;
    description: string;
    amount: string;
    status: string;
    pdf: string | null;
};