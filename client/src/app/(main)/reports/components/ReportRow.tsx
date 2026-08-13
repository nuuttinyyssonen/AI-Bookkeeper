'use client';

import DownloadButton from "./DownloadButton"
import Link from "next/link"
import { useTranslations } from "next-intl";
import { VatReport } from "@/app/types/report";

interface Props {
    report: VatReport
}

export default function ReportRow({report}: Props) {
    const t = useTranslations('reportRow');

    return (
        <tr key={report.id} data-testid="report-row" className="hover:bg-slate-50 hover:dark:bg-slate-900 transition-colors">
            <td data-testid="report-period" className="px-5 py-4 font-medium text-slate-900 dark:text-slate-50">
                {new Date(report.period_start).toLocaleDateString("fi-FI")} –{" "}
                {new Date(report.period_end).toLocaleDateString("fi-FI")}
            </td>
            <td data-testid="report-type" className="px-5 py-4">
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                {report.period_type}
                </span>
            </td>
            <td data-testid="report-sales-vat" className="px-5 py-4 text-teal-700 dark:text-teal-200 font-medium">
                {Number(report.sales_vat_amount).toFixed(2)} €
            </td>
            <td data-testid="report-purchase-vat" className="px-5 py-4 text-slate-700 dark:text-slate-200">
                {Number(report.purchase_vat_amount).toFixed(2)} €
            </td>
            <td data-testid="report-payable" className="px-5 py-4 font-semibold">
                <span className={Number(report.vat_payable) >= 0 ? "text-rose-600 dark:text-rose-300" : "text-teal-600 dark:text-teal-300"}>
                {Number(report.vat_payable) >= 0
                    ? t('payable', { amount: Math.abs(Number(report.vat_payable)).toFixed(2) })
                    : t('refund', { amount: Math.abs(Number(report.vat_payable)).toFixed(2) })}
                </span>
            </td>
            <td data-testid="report-status" className="px-5 py-4">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                report.vat_declaration_sent
                    ? "bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-200"
                    : "bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-200"
                }`}>
                {report.vat_declaration_sent ? t('submitted') : t('pending')}
                </span>
            </td>
            <td data-testid="report-created" className="px-5 py-4 text-slate-500 dark:text-slate-400">
                {new Date(report.created_at).toLocaleDateString("fi-FI")}
            </td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                <Link
                    href={`/reports/${report.id}`}
                    data-testid="report-view-link"
                    className="rounded-md border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:dark:bg-slate-900"
                >
                    {t('view')}
                </Link>
                <DownloadButton id={report.id}/>
                </div>
            </td>
            </tr>
    );
};