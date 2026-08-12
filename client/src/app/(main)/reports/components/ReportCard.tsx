'use client';

import DownloadButton from "./DownloadButton"
import Link from "next/link"
import { useTranslations } from "next-intl";
import { VatReport } from "@/app/types/report";

interface Props {
    report: VatReport
}

export default function ReportCard({report}: Props) {
    const t = useTranslations('reportRow');
    const th = useTranslations('reportTableHead');

    return (
        <div data-testid="report-card" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-medium text-slate-900">
                        {new Date(report.period_start).toLocaleDateString("fi-FI")} –{" "}
                        {new Date(report.period_end).toLocaleDateString("fi-FI")}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {report.period_type}
                    </span>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    report.vat_declaration_sent
                        ? "bg-teal-50 text-teal-700"
                        : "bg-amber-50 text-amber-700"
                }`}>
                    {report.vat_declaration_sent ? t('submitted') : t('pending')}
                </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <div>
                    <dt className="text-slate-500">{th('salesVat')}</dt>
                    <dd className="font-medium text-teal-700">{Number(report.sales_vat_amount).toFixed(2)} €</dd>
                </div>
                <div>
                    <dt className="text-slate-500">{th('purchaseVat')}</dt>
                    <dd className="text-slate-700">{Number(report.purchase_vat_amount).toFixed(2)} €</dd>
                </div>
                <div>
                    <dt className="text-slate-500">{th('payableRefund')}</dt>
                    <dd className={`font-semibold ${Number(report.vat_payable) >= 0 ? "text-rose-600" : "text-teal-600"}`}>
                        {Number(report.vat_payable) >= 0
                            ? t('payable', { amount: Math.abs(Number(report.vat_payable)).toFixed(2) })
                            : t('refund', { amount: Math.abs(Number(report.vat_payable)).toFixed(2) })}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">{th('created')}</dt>
                    <dd className="text-slate-500">{new Date(report.created_at).toLocaleDateString("fi-FI")}</dd>
                </div>
            </dl>

            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                <Link
                    href={`/reports/${report.id}`}
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    {t('view')}
                </Link>
                <DownloadButton id={report.id}/>
            </div>
        </div>
    );
};
