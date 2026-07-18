'use client';

import { useTranslations } from "next-intl";
import { VatReport } from "@/app/types/report";

interface Props {
    report: VatReport
}

export default function VatReturned({report}: Props) {
    const t = useTranslations('vatReturned');

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
            <div>
                <p className="font-medium text-slate-900">{t('title')}</p>
                <p className="text-sm text-slate-500 mt-0.5">{t('description')}</p>
            </div>
            <button className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                report.vat_declaration_sent
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}>
                {report.vat_declaration_sent ? t('submitted') : t('notSubmitted')}
            </button>
        </div>
    );
};