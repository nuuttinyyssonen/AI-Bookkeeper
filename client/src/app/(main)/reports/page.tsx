import { authenticateUser } from "@/lib/auth";
import { getReports } from "./action";
import Link from "next/link";

export default async function ReportsPage() {
    await authenticateUser();
    const reports = await getReports();

    return (
        <div className="min-h-screen bg-slate-50">
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

            <div className="px-4 py-6 sm:px-6 lg:px-8">
                {reports && reports.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                                    <th className="px-5 py-3 font-medium text-slate-500">Period</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Type</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Sales VAT</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Purchase VAT</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Payable / Refund</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Created</th>
                                    <th className="px-5 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reports.map((report: any) => (
                                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4 font-medium text-slate-900">
                                            {new Date(report.period_start).toLocaleDateString("fi-FI")} –{" "}
                                            {new Date(report.period_end).toLocaleDateString("fi-FI")}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                {report.period_type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-teal-700 font-medium">
                                            {Number(report.sales_vat_amount).toFixed(2)} €
                                        </td>
                                        <td className="px-5 py-4 text-slate-700">
                                            {Number(report.purchase_vat_amount).toFixed(2)} €
                                        </td>
                                        <td className="px-5 py-4 font-semibold">
                                            <span className={Number(report.vat_payable) >= 0 ? "text-rose-600" : "text-teal-600"}>
                                                {Number(report.vat_payable) >= 0 ? "Pay " : "Refund "}
                                                {Math.abs(Number(report.vat_payable)).toFixed(2)} €
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                report.vat_declaration_sent
                                                    ? "bg-teal-50 text-teal-700"
                                                    : "bg-amber-50 text-amber-700"
                                            }`}>
                                                {report.vat_declaration_sent ? "Submitted" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-500">
                                            {new Date(report.created_at).toLocaleDateString("fi-FI")}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/reports/${report.id}`}
                                                    className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                                >
                                                    View
                                                </Link>
                                                <button className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700">
                                                    Download PDF
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
}