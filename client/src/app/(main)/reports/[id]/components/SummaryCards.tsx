'use client';

import { useTranslations } from "next-intl";

interface Props {
    report: any,
    isRefund: boolean
};

export default function SummaryCards({report, isRefund}: Props) {
    const t = useTranslations('summaryCards');

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{t('salesVat')}</p>
                <p className="mt-2 text-2xl font-semibold text-teal-600">
                    {Number(report.sales_vat_amount).toFixed(2)} €
                </p>
                <p className="mt-1 text-xs text-slate-500">{t('net', { amount: Number(report.sales_net).toFixed(2) })}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{t('purchaseVat')}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-700">
                    {Number(report.purchase_vat_amount).toFixed(2)} €
                </p>
                <p className="mt-1 text-xs text-slate-500">{t('net', { amount: Number(report.purchase_net).toFixed(2) })}</p>
            </div>
            <div className={`rounded-xl border p-5 shadow-sm ${
                isRefund
                    ? "border-teal-200 bg-teal-50"
                    : "border-rose-200 bg-rose-50"
            }`}>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {isRefund ? t('vatRefund') : t('vatPayable')}
                </p>
                <p className={`mt-2 text-2xl font-semibold ${isRefund ? "text-teal-700" : "text-rose-600"}`}>
                    {Math.abs(Number(report.vat_payable)).toFixed(2)} €
                </p>
                <p className="mt-1 text-xs text-slate-500">
                    {isRefund ? t('refundNote') : t('payableNote')}
                </p>
            </div>
        </div>
    );
};