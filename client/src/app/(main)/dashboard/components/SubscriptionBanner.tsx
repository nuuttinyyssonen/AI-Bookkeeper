import { getTranslations } from 'next-intl/server';
import Link from "next/link";

interface Subscription {
    subscription_type: 'BASIC' | 'PREMIUM' | 'BASIC_YEARLY' | 'PREMIUM_YEARLY';
    subscription_status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE';
    current_period_end: string;
}

interface SubscriptionBannerProps {
    subscription: Subscription;
}

export default async function SubscriptionBanner({ subscription }: SubscriptionBannerProps) {
    const t = await getTranslations('subscriptionBanner');

    if (!subscription) {
        return (
            <div className="flex items-center justify-between rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900 px-4 py-3">
                <p className="text-sm text-amber-800 dark:text-amber-100">{t('noSubscription')}</p>
                <Link href="/pricing" className="text-sm font-medium text-amber-800 dark:text-amber-100 underline hover:text-amber-900 hover:dark:text-amber-50">
                    {t('subscribeNow')}
                </Link>
            </div>
        );
    }

    if (subscription.subscription_status === 'PAST_DUE') {
        return (
            <div className="flex items-center justify-between rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900 px-4 py-3">
                <p className="text-sm text-red-800 dark:text-red-100">{t('pastDue')}</p>
                <Link href="/billing" className="text-sm font-medium text-red-800 dark:text-red-100 underline hover:text-red-900 hover:dark:text-red-50">
                    {t('updatePayment')}
                </Link>
            </div>
        );
    }

    if (subscription.subscription_status === 'CANCELLED') {
        const periodEnd = new Date(subscription.current_period_end).toLocaleDateString('fi-FI');
        return (
            <div className="flex items-center justify-between rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900 px-4 py-3">
                <p className="text-sm text-amber-800 dark:text-amber-100">{t('cancelled', { date: periodEnd })}</p>
                <Link href="/pricing" className="text-sm font-medium text-amber-800 dark:text-amber-100 underline hover:text-amber-900 hover:dark:text-amber-50">
                    {t('reactivate')}
                </Link>
            </div>
        );
    }

    const planConfig: Record<string, { messageKey: string; linkKey: string; href: string }> = {
        BASIC: { messageKey: 'basicPlan', linkKey: 'upgradeToPremium', href: '/pricing' },
        PREMIUM: { messageKey: 'premiumPlan', linkKey: 'viewPlans', href: '/pricing' },
        BASIC_YEARLY: { messageKey: 'basicYearlyPlan', linkKey: 'upgradeToPremium', href: '/pricing' },
        PREMIUM_YEARLY: { messageKey: 'premiumYearlyPlan', linkKey: 'viewPlans', href: '/pricing' },
    };

    const config = planConfig[subscription.subscription_type];
    if (!config) return null;

    return (
        <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50 dark:bg-teal-900 px-4 py-3">
            <p className="text-sm text-teal-800 dark:text-teal-100">
                {t.rich(config.messageKey, {
                    bold: (chunks) => <span className="font-medium">{chunks}</span>,
                })}
            </p>
            <Link href={config.href} className="text-sm font-medium text-teal-800 dark:text-teal-100 underline hover:text-teal-900 hover:dark:text-teal-50">
                {t(config.linkKey)}
            </Link>
        </div>
    );
}