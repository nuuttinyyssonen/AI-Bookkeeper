"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function Footer() {
    const t = useTranslations('settingsFooter');
    const tDemo = useTranslations('demo');

    return (
        <div>
            <div className="rounded-lg border border-red-200 bg-white p-6 space-y-3">
                <h2 className="text-sm font-medium text-slate-950">{t('dangerZone')}</h2>
                <p className="text-sm text-muted-foreground">{t('deleteWarning')}</p>

                <button
                    onClick={() => toast.error(tDemo('accountDeleteBlocked'))}
                    className="h-9 px-4 rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                    {t('deleteAccount')}
                </button>
            </div>

            <div className="text-center">
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-slate-700 underline">
                    {t('backToDashboard')}
                </Link>
            </div>
        </div>
    );
};
