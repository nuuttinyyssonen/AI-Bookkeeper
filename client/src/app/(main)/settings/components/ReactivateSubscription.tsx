'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { reactivateSubscription } from "../action";

export default function ReactivateSubscription() {
    const t = useTranslations('reactivateSubscription');
    const [isConfirming, setIsConfirming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleReactivate = async () => {
        setIsLoading(true);
        const response = await reactivateSubscription();
        setIsLoading(false);

        if (response?.error) {
            toast.error(response.error);
            return;
        }

        toast.success(t('reactivateSuccess'));
        setIsConfirming(false);
    };

    if (isConfirming) {
        return (
            <div className="rounded-lg border border-teal-200 bg-teal-50 dark:bg-teal-900 p-3 space-y-2">
                <p className="text-xs text-teal-800 dark:text-teal-100">
                    {t('warning')}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={handleReactivate}
                        disabled={isLoading}
                        className="flex-1 h-8 rounded-md bg-teal-700 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? t('reactivating') : t('confirmReactivation')}
                    </button>
                    <button
                        onClick={() => setIsConfirming(false)}
                        disabled={isLoading}
                        className="flex-1 h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:dark:bg-slate-900 disabled:opacity-50 transition-colors"
                    >
                        {t('cancel')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsConfirming(true)}
            className="h-9 px-4 rounded-md border border-teal-300 bg-white dark:bg-slate-950 text-sm font-medium text-teal-700 dark:text-teal-200 hover:bg-teal-50 hover:dark:bg-teal-900 transition-colors"
        >
            {t('reactivateSubscription')}
        </button>
    );
}