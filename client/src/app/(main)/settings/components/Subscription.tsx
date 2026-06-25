import Link from "next/link";

import CancelSubscription from "./CancelSubscription";

interface Props {
    subscription: any
};

export default function Subscription({ subscription }: Props) {
    const periodEnd = subscription?.current_period_end
        ? new Date(subscription.current_period_end).toLocaleDateString('fi-FI')
        : null;

    const periodStart = subscription?.current_period_start
        ? new Date(subscription.current_period_start).toLocaleDateString('fi-FI')
        : null;

    return (
        <div className="rounded-lg border border-border bg-white p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-950">Subscription</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Current plan</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-950">
                            {subscription?.subscription_type ?? '—'}
                        </p>
                        {subscription?.subscription_status === 'ACTIVE' && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                                Active
                            </span>
                        )}
                        {subscription?.subscription_status === 'CANCELLED' && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                Cancelled
                            </span>
                        )}
                        {subscription?.subscription_status === 'PAST_DUE' && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200">
                                Past due
                            </span>
                        )}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Current period start</p>
                    <p className="text-sm font-medium text-slate-950">{periodStart ?? '—'}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Next billing date</p>
                    <p className="text-sm font-medium text-slate-950">{periodEnd ?? '—'}</p>
                </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
                <Link
                    href="/pricing"
                    className="h-9 px-4 rounded-md bg-teal-700 text-sm font-medium text-white hover:bg-teal-800 transition-colors flex items-center"
                >
                    Change plan
                </Link>
                <CancelSubscription />
            </div>
        </div>
    );
};