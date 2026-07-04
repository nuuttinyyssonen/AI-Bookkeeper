'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cancelSubscription } from "../action";
import { toast } from "sonner";

export default function CancelSubscription() {
    const t = useTranslations('cancelSubscription');
    const [isConfirming, setIsConfirming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCancel = async () => {
        setIsLoading(true);
        const response = await cancelSubscription();
        setIsLoading(false);

        if (response?.error) {
            toast.error(response.error);
            return;
        }

        toast.success(t('cancelSuccess'));
        setIsConfirming(false);
    };

    if (isConfirming) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-2">
                <p className="text-xs text-red-800">
                    {t('warning')}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1 h-8 rounded-md bg-red-600 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? t('cancelling') : t('confirmCancellation')}
                    </button>
                    <button
                        onClick={() => setIsConfirming(false)}
                        disabled={isLoading}
                        className="flex-1 h-8 rounded-md border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        {t('keepSubscription')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsConfirming(true)}
            className="h-9 px-4 rounded-md border border-red-300 bg-white text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
            {t('cancelSubscription')}
        </button>
    );
}