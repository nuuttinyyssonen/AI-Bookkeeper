'use client';

import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function CancelSubscription() {
    const t = useTranslations('cancelSubscription');
    const tDemo = useTranslations('demo');

    return (
        <button
            onClick={() => toast.error(tDemo('subscriptionBlocked'))}
            className="h-9 px-4 rounded-md border border-red-300 bg-white text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
            {t('cancelSubscription')}
        </button>
    );
}
