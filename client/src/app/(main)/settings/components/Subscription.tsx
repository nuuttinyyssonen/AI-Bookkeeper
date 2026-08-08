'use client';

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import CancelSubscription from "./CancelSubscription";
import ReactivateSubscription from "./ReactivateSubscription";
import { Subscription as SubscriptionData } from "@/app/types/subscription";

interface Props {
    subscription: SubscriptionData | null;
}

export default function Subscription({ subscription }: Props) {
    const t = useTranslations('subscription');
    const tDemo = useTranslations('demo');

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
        <div className="rounded-lg border border-border bg-white p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-950">{t('title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('currentPlan')}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-950">
                            {subscription?.subscription_type}
                        </p>
                        {isCancelledAtPeriodEnd ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                {t('cancels', { date: periodEnd ?? '' })}
                            </span>
                        ) : subscription?.subscription_status === 'ACTIVE' ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                                {t('active')}
                            </span>
                        ) : isCancelled ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                {t('cancelled')}
                            </span>
                        ) : subscription?.subscription_status === 'PAST_DUE' ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200">
                                {t('pastDue')}
                            </span>
                        ) : null}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('currentPeriodStart')}</p>
                    <p className="text-sm font-medium text-slate-950">{periodStart ?? t('noValue')}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        {showAccessUntil ? t('accessUntil') : t('nextBillingDate')}
                    </p>
                    <p className="text-sm font-medium text-slate-950">{periodEnd ?? t('noValue')}</p>
                </div>
            </div>
            <div className="pt-2 flex flex-wrap gap-2">
                <button
                    onClick={() => toast.error(tDemo('subscriptionBlocked'))}
                    className="h-9 px-4 rounded-md bg-teal-700 text-sm font-medium text-white hover:bg-teal-800 transition-colors flex items-center"
                >
                    {t('changePlan')}
                </button>
                {isCancelledAtPeriodEnd || isCancelled ? (
                    <ReactivateSubscription />
                ) : (
                    <CancelSubscription />
                )}
            </div>
        </div>
    );
}