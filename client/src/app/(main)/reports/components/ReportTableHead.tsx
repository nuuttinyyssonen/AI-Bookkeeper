'use client';

import { useTranslations } from "next-intl";

export default function ReportTableHead() {
    const t = useTranslations('reportTableHead');

    return (
        <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-5 py-3 font-medium text-slate-500">{t('period')}</th>
                <th className="px-5 py-3 font-medium text-slate-500">{t('type')}</th>
                <th className="px-5 py-3 font-medium text-slate-500">{t('salesVat')}</th>
                <th className="px-5 py-3 font-medium text-slate-500">{t('purchaseVat')}</th>
                <th className="px-5 py-3 font-medium text-slate-500">{t('payableRefund')}</th>
                <th className="px-5 py-3 font-medium text-slate-500">{t('status')}</th>
                <th className="px-5 py-3 font-medium text-slate-500">{t('created')}</th>
                <th className="px-5 py-3" />
            </tr>
        </thead>
    );
};