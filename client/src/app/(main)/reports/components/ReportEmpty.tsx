'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ReportEmpty() {
    const t = useTranslations('reportEmpty');

    return(
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-16 text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{t('title')}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {t('description')}
            </p>
            <Link
                href="/reports/new"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
                {t('newReport')}
            </Link>
        </div>
    );
};