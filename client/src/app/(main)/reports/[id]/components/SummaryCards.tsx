'use client';

import { useTranslations } from "next-intl";
import { VatReport } from "@/app/types/report";

interface Props {
    report: VatReport,
    isRefund: boolean
};

export default function SummaryCards({report, isRefund}: Props) {
    const t = useTranslations('summaryCards');

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('salesVat')}</p>
                <p className="mt-2 text-2xl font-semibold text-teal-600 dark:text-teal-300">
                    {Number(report.sales_vat_amount).toFixed(2)} €
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('net', { amount: Number(report.sales_net).toFixed(2) })}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('purchaseVat')}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-700 dark:text-slate-200">
                    {Number(report.purchase_vat_amount).toFixed(2)} €
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('net', { amount: Number(report.purchase_net).toFixed(2) })}</p>
            </div>
            <div className={`rounded-xl border p-5 shadow-sm ${
                isRefund
                    ? "border-teal-200 bg-teal-50 dark:bg-teal-900"
                    : "border-rose-200 dark:border-rose-700 bg-rose-50 dark:bg-rose-900"
            }`}>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {isRefund ? t('vatRefund') : t('vatPayable')}
                </p>
                <p className={`mt-2 text-2xl font-semibold ${isRefund ? "text-teal-700 dark:text-teal-200" : "text-rose-600 dark:text-rose-300"}`}>
                    {Math.abs(Number(report.vat_payable)).toFixed(2)} €
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {isRefund ? t('refundNote') : t('payableNote')}
                </p>
            </div>
        </div>
    );
};