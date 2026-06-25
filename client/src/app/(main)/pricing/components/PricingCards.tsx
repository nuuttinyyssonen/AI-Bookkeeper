'use client';

import { useState } from "react";
import { upgradeSubscription } from "../action";
import { subscriptionType, SubscriptionType } from "@/app/types/subscription";

const plans = [
    {
        id: subscriptionType.basic,
        yearlyId: subscriptionType.basicYearly,
        name: 'Basic',
        monthlyPrice: '€19.99',
        yearlyPrice: '€199.99',
        yearlyMonthly: '€16.67',
        description: 'For individuals and freelancers',
        features: ['Unlimited receipts', 'AI bookkeeper', 'Monthly reports', 'Email support'],
        popular: false,
    },
    {
        id: subscriptionType.premium,
        yearlyId: subscriptionType.premiumYearly,
        name: 'Premium',
        monthlyPrice: '€39.99',
        yearlyPrice: '€399.99',
        yearlyMonthly: '€33.33',
        description: 'For small businesses',
        features: ['Everything in Basic', 'Priority support', 'Advanced analytics', 'Multi-user access'],
        popular: true,
    },
];

interface Props {
    isYearly: boolean;
    subscription: any;
};

export default function PricingCards({ isYearly, subscription }: Props) {
    const currentPlanId = subscription?.subscription_type;
    const [confirmingPlanId, setConfirmingPlanId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelect = (planId: string) => {
        setConfirmingPlanId(planId);
    };

    const handleConfirm = async (subscriptionType: SubscriptionType) => {
        setIsLoading(true);
        await upgradeSubscription(subscriptionType);
        setIsLoading(false);
        setConfirmingPlanId(null);
    };

    const handleCancel = () => {
        setConfirmingPlanId(null);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {plans.map((plan) => {
                const planId = isYearly ? plan.yearlyId : plan.id;
                const isCurrent = currentPlanId === planId;
                const isConfirming = confirmingPlanId === planId;
                const price = isYearly ? plan.yearlyMonthly : plan.monthlyPrice;

                return (
                    <div
                        key={plan.id}
                        className={`relative rounded-lg bg-white p-6 space-y-4 ${
                            isCurrent
                                ? 'border-2 border-teal-700'
                                : plan.popular
                                ? 'border-2 border-slate-200'
                                : 'border border-border'
                        }`}
                    >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            {isCurrent ? (
                                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                                    Current plan
                                </span>
                            ) : plan.popular ? (
                                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                                    Most popular
                                </span>
                            ) : null}
                        </div>

                        <div>
                            <p className="text-base font-medium text-slate-950">{plan.name}</p>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-semibold text-slate-950">
                                    {price}
                                </span>
                                <span className="text-sm text-muted-foreground">/ mo</span>
                            </div>
                            {isYearly && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Billed as {plan.yearlyPrice} / year
                                </p>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                        </div>

                        <ul className="space-y-2">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <svg className="w-4 h-4 text-teal-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {isConfirming ? (
                            <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                <p className="text-xs text-amber-800">
                                    You will be charged <span className="font-medium">{isYearly ? plan.yearlyPrice + ' / year' : price + ' / mo'}</span> immediately. Confirm?
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleConfirm(isYearly ? plan.yearlyId : plan.id)}
                                        disabled={isLoading}
                                        className="flex-1 h-8 rounded-md bg-teal-700 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50 transition-colors"
                                    >
                                        {isLoading ? 'Processing...' : 'Confirm'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="flex-1 h-8 rounded-md border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleSelect(planId)}
                                disabled={isCurrent}
                                className={`w-full h-10 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isCurrent
                                        ? 'bg-slate-100 text-slate-400 border border-slate-200'
                                        : plan.popular
                                        ? 'bg-teal-700 text-white hover:bg-teal-800'
                                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                {isCurrent ? 'Current plan' : `Select ${plan.name}`}
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};