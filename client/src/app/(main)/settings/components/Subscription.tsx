'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";
import CancelSubscription from "./CancelSubscription";
import ReactivateSubscription from "./ReactivateSubscription";
import { Subscription as SubscriptionData } from "@/app/types/subscription";

interface Props {
    subscription: SubscriptionData | null;
}

export default function Subscription({ subscription }: Props) {
    const t = useTranslations('subscription');

    const periodEnd = subscription?.current_period_end
        ? new Date(subscription.current_period_end).toLocaleDateString('fi-FI')
        : null;

    const periodStart = subscription?.current_period_start
        ? new Date(subscription.current_period_start).toLocaleDateString('fi-FI')
        : null;

    const isCancelledAtPeriodEnd = subscription?.cancel_at_period_end;
    const isCancelled = subscription?.subscription_status === 'CANCELLED';
    const showAccessUntil = isCancelledAtPeriodEnd || isCancelled;

    return (
        <div className="rounded-lg border border-border bg-white dark:bg-slate-950 p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-950 dark:text-slate-50">{t('title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('currentPlan')}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-950 dark:text-slate-50">
                            {subscription?.subscription_type}
                        </p>
                        {isCancelledAtPeriodEnd ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900 text-amber-800 dark:text-amber-100 border border-amber-200 dark:border-amber-700">
                                {t('cancels', { date: periodEnd ?? '' })}
                            </span>
                        ) : subscription?.subscription_status === 'ACTIVE' ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900 text-teal-800 dark:text-teal-100 border border-teal-200">
                                {t('active')}
                            </span>
                        ) : isCancelled ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900 text-amber-800 dark:text-amber-100 border border-amber-200 dark:border-amber-700">
                                {t('cancelled')}
                            </span>
                        ) : subscription?.subscription_status === 'PAST_DUE' ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-200 dark:border-red-700">
                                {t('pastDue')}
                            </span>
                        ) : null}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('currentPeriodStart')}</p>
                    <p className="text-sm font-medium text-slate-950 dark:text-slate-50">{periodStart ?? t('noValue')}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        {showAccessUntil ? t('accessUntil') : t('nextBillingDate')}
                    </p>
                    <p className="text-sm font-medium text-slate-950 dark:text-slate-50">{periodEnd ?? t('noValue')}</p>
                </div>
            </div>
            <div className="pt-2 flex flex-wrap gap-2">
                <Link
                    href="/pricing"
                    className="h-9 px-4 rounded-md bg-teal-700 text-sm font-medium text-white hover:bg-teal-800 transition-colors flex items-center"
                >
                    {t('changePlan')}
                </Link>
                {isCancelledAtPeriodEnd || isCancelled ? (
                    <ReactivateSubscription />
                ) : (
                    <CancelSubscription />
                )}
            </div>
        </div>
    );
}