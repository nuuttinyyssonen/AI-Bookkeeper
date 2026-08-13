'use client';

import { useTranslations } from "next-intl";

export default function Header() {
    const t = useTranslations('settingsHeader');

    return (
        <div>
            <p className="text-sm font-medium text-teal-700 dark:text-teal-200">{t('eyebrow')}</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-slate-50">{t('title')}</h1>
        </div>
    );
};