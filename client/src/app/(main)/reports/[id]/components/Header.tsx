import DownloadPDF from "./DownloadPDF";
import Link from "next/link";

interface Props {
    report: any,
    id: string
};

export default function Header({report, id}: Props) {
    return (
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/reports" className="text-sm text-slate-500 hover:text-slate-700">
                        ← Back to reports
                    </Link>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                        VAT Report – {report.period_type}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {new Date(report.period_start).toLocaleDateString("fi-FI")} –{" "}
                        {new Date(report.period_end).toLocaleDateString("fi-FI")}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        report.vat_declaration_sent
                            ? "bg-teal-50 text-teal-700"
                            : "bg-amber-50 text-amber-700"
                    }`}>
                        {report.vat_declaration_sent ? "Submitted" : "Pending"}
                    </span>
                    <DownloadPDF id={id} />
                </div>
            </div>
        </header>
    );
};