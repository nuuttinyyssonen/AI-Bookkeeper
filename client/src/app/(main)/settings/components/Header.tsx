'use client';

import { useTranslations } from "next-intl";

export default function Header() {
    const t = useTranslations('settingsHeader');

    return (
        <div>
            <p className="text-sm font-medium text-teal-700">{t('eyebrow')}</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">{t('title')}</h1>
        </div>
    );
};