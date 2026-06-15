import Link from "next/link";

export default function Header() {
    return (
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-teal-700">Reports</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        VAT reports
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Generate and download VAT summaries for your tax returns.
                    </p>
                </div>
                <Link
                    href="/reports/new"
                    className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                >
                    + New report
                </Link>
            </div>
        </header>
    );
};