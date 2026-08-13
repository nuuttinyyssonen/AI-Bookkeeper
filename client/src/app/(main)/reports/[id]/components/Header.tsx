'use client';

import { useTranslations } from "next-intl";
import DownloadPDF from "./DownloadPDF";
import Link from "next/link";
import DeleteReport from "./DeleteReport";
import { VatReport } from "@/app/types/report";

interface Props {
    report: VatReport,
    id: string,
    setDeleted: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({report, id, setDeleted}: Props) {
    const t = useTranslations('reportHeader');

    return (
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/reports" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:dark:text-slate-200">
                        ← {t('back')}
                    </Link>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                        {t('title', { period: report.period_type })}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(report.period_start).toLocaleDateString("fi-FI")} –{" "}
                        {new Date(report.period_end).toLocaleDateString("fi-FI")}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        report.vat_declaration_sent
                            ? "bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-200"
                            : "bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-200"
                    }`}>
                        {report.vat_declaration_sent ? t('submitted') : t('pending')}
                    </span>
                    <DeleteReport id={id} setDeleted={setDeleted}/>
                    <DownloadPDF id={id} />
                </div>
            </div>
        </header>
    );
};