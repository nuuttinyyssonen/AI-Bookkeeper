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
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-800">{t('noSubscription')}</p>
                <Link href="/pricing" className="text-sm font-medium text-amber-800 underline hover:text-amber-900">
                    {t('subscribeNow')}
                </Link>
            </div>
        );
    }

    if (subscription.subscription_status === 'PAST_DUE') {
        return (
            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-800">{t('pastDue')}</p>
                <Link href="/billing" className="text-sm font-medium text-red-800 underline hover:text-red-900">
                    {t('updatePayment')}
                </Link>
            </div>
        );
    }

    if (subscription.subscription_status === 'CANCELLED') {
        const periodEnd = new Date(subscription.current_period_end).toLocaleDateString('fi-FI');
        return (
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-800">{t('cancelled', { date: periodEnd })}</p>
                <Link href="/pricing" className="text-sm font-medium text-amber-800 underline hover:text-amber-900">
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
        <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50 px-4 py-3">
            <p className="text-sm text-teal-800">
                {t.rich(config.messageKey, {
                    bold: (chunks) => <span className="font-medium">{chunks}</span>,
                })}
            </p>
            <Link href={config.href} className="text-sm font-medium text-teal-800 underline hover:text-teal-900">
                {t(config.linkKey)}
            </Link>
        </div>
    );
}