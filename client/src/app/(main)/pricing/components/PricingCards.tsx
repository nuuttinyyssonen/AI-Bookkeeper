'use client';

import { useTranslations } from 'next-intl';
import { useState } from "react";
import { upgradeSubscription } from "../action";
import { subscriptionType, Subscription, SubscriptionType } from "@/app/types/subscription";

const planKeys = ['basic', 'premium'] as const;

const planMeta = {
    basic: {
        id: subscriptionType.basic,
        yearlyId: subscriptionType.basicYearly,
        name: 'Basic',
        monthlyPrice: '€19.99',
        yearlyPrice: '€199.99',
        yearlyMonthly: '€16.67',
        popular: false,
    },
    premium: {
        id: subscriptionType.premium,
        yearlyId: subscriptionType.premiumYearly,
        name: 'Premium',
        monthlyPrice: '€39.99',
        yearlyPrice: '€399.99',
        yearlyMonthly: '€33.33',
        popular: true,
    },
};

interface Props {
    isYearly: boolean;
    subscription: Subscription | null;
}

export default function PricingCards({ isYearly, subscription }: Props) {
    const t = useTranslations('pricingCards');
    const currentPlanId = subscription?.subscription_type;
    const [confirmingPlanId, setConfirmingPlanId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelect = (planId: string) => setConfirmingPlanId(planId);
    const handleCancel = () => setConfirmingPlanId(null);

    const handleConfirm = async (subscriptionType: SubscriptionType) => {
        setIsLoading(true);
        await upgradeSubscription(subscriptionType);
        setIsLoading(false);
        setConfirmingPlanId(null);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {planKeys.map((key) => {
                const plan = planMeta[key];
                const planId = isYearly ? plan.yearlyId : plan.id;
                const isCurrent = currentPlanId === planId;
                const isConfirming = confirmingPlanId === planId;
                const price = isYearly ? plan.yearlyMonthly : plan.monthlyPrice;
                const features = t.raw(`plans.${key}.features`) as string[];

                return (
                    <div
                        key={plan.id}
                        className={`relative rounded-lg bg-white dark:bg-slate-950 p-6 space-y-4 ${
                            isCurrent ? 'border-2 border-teal-700' : plan.popular ? 'border-2 border-slate-200 dark:border-slate-700' : 'border border-border'
                        }`}
                    >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            {isCurrent ? (
                                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900 text-teal-800 dark:text-teal-100 border border-teal-200">
                                    {t('currentPlan')}
                                </span>
                            ) : plan.popular ? (
                                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    {t('mostPopular')}
                                </span>
                            ) : null}
                        </div>

                        <div>
                            <p className="text-base font-medium text-slate-950 dark:text-slate-50">{plan.name}</p>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-semibold text-slate-950 dark:text-slate-50">{price}</span>
                                <span className="text-sm text-muted-foreground">{t('perMonth')}</span>
                            </div>
                            {isYearly && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {t('billedAs', { price: plan.yearlyPrice })}
                                </p>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">{t(`plans.${key}.description`)}</p>
                        </div>

                        <ul className="space-y-2">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <svg className="w-4 h-4 text-teal-700 dark:text-teal-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {isConfirming ? (
                            <div className="space-y-2 rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900 p-3">
                                <p className="text-xs text-amber-800 dark:text-amber-100">
                                    {t.rich('confirmCharge', {
                                        price: isYearly ? `${plan.yearlyPrice} / year` : `${price} / mo`,
                                        bold: (chunks) => <span className="font-medium">{chunks}</span>,
                                    })}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleConfirm(isYearly ? plan.yearlyId : plan.id)}
                                        disabled={isLoading}
                                        className="flex-1 h-8 rounded-md bg-teal-700 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50 transition-colors"
                                    >
                                        {isLoading ? t('processing') : t('confirm')}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="flex-1 h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:dark:bg-slate-900 disabled:opacity-50 transition-colors"
                                    >
                                        {t('cancel')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleSelect(planId)}
                                disabled={isCurrent}
                                className={`w-full h-10 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isCurrent ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                                    : plan.popular ? 'bg-teal-700 text-white hover:bg-teal-800'
                                    : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:dark:bg-slate-900'
                                }`}
                            >
                                {isCurrent ? t('currentPlan') : t('selectPlan', { name: plan.name })}
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}