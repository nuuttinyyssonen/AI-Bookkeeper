export const subscriptionType = {
    basic: 'BASIC',
    premium: 'PREMIUM',
    basicYearly: 'BASIC_YEARLY',
    premiumYearly: 'PREMIUM_YEARLY',
} as const;

export type SubscriptionType = typeof subscriptionType[keyof typeof subscriptionType];