import Link from "next/link";

export default function ReportEmpty() {
    return(
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-16 text-center">
            <p className="text-lg font-semibold text-slate-900">No reports yet</p>
            <p className="mt-2 text-sm text-slate-500">
                Generate your first VAT report to prepare for your tax return.
            </p>
            <Link
                href="/reports/new"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
                + New report
            </Link>
        </div>
    );
};