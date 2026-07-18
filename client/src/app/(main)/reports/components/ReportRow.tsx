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
        <tr key={report.id} data-testid="report-row" className="hover:bg-slate-50 transition-colors">
            <td data-testid="report-period" className="px-5 py-4 font-medium text-slate-900">
                {new Date(report.period_start).toLocaleDateString("fi-FI")} –{" "}
                {new Date(report.period_end).toLocaleDateString("fi-FI")}
            </td>
            <td data-testid="report-type" className="px-5 py-4">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {report.period_type}
                </span>
            </td>
            <td data-testid="report-sales-vat" className="px-5 py-4 text-teal-700 font-medium">
                {Number(report.sales_vat_amount).toFixed(2)} €
            </td>
            <td data-testid="report-purchase-vat" className="px-5 py-4 text-slate-700">
                {Number(report.purchase_vat_amount).toFixed(2)} €
            </td>
            <td data-testid="report-payable" className="px-5 py-4 font-semibold">
                <span className={Number(report.vat_payable) >= 0 ? "text-rose-600" : "text-teal-600"}>
                {Number(report.vat_payable) >= 0
                    ? t('payable', { amount: Math.abs(Number(report.vat_payable)).toFixed(2) })
                    : t('refund', { amount: Math.abs(Number(report.vat_payable)).toFixed(2) })}
                </span>
            </td>
            <td data-testid="report-status" className="px-5 py-4">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                report.vat_declaration_sent
                    ? "bg-teal-50 text-teal-700"
                    : "bg-amber-50 text-amber-700"
                }`}>
                {report.vat_declaration_sent ? t('submitted') : t('pending')}
                </span>
            </td>
            <td data-testid="report-created" className="px-5 py-4 text-slate-500">
                {new Date(report.created_at).toLocaleDateString("fi-FI")}
            </td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                <Link
                    href={`/reports/${report.id}`}
                    data-testid="report-view-link"
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    {t('view')}
                </Link>
                <DownloadButton id={report.id}/>
                </div>
            </td>
            </tr>
    );
};