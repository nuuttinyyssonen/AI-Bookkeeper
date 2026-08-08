'use client';

import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function ReactivateSubscription() {
    const t = useTranslations('reactivateSubscription');
    const tDemo = useTranslations('demo');

    return (
        <button
            onClick={() => toast.error(tDemo('subscriptionBlocked'))}
            className="h-9 px-4 rounded-md border border-teal-300 bg-white text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors"
        >
            {t('reactivateSubscription')}
        </button>
    );
}
