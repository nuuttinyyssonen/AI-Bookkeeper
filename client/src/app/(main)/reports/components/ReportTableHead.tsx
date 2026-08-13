'use client';

import { useTranslations } from "next-intl";

export default function ReportTableHead() {
    const t = useTranslations('reportTableHead');

    return (
        <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-left">
                <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{t('period')}</th>
                <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{t('type')}</th>
                <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{t('salesVat')}</th>
                <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{t('purchaseVat')}</th>
                <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{t('payableRefund')}</th>
                <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{t('status')}</th>
                <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">{t('created')}</th>
                <th className="px-5 py-3" />
            </tr>
        </thead>
    );
};