import { authenticateUser } from "@/lib/auth";
import { getReportById } from "./action";
import Link from "next/link";
import { notFound } from "next/navigation";
import DownloadPDF from "./components/DownloadPDF";

export default async function ReportPage({ params }: { params: { id: string } }) {
    await authenticateUser();
    const { id } = await params;
    const report = await getReportById(id);

    if (!report) return notFound();

    const vatBreakdown = report.vat_breakdown as {
        sales: { rate: number; net: number; vat_amount: number; gross: number }[];
        purchases: { rate: number; net: number; vat_amount: number; gross: number }[];
    };

    const isRefund = Number(report.vat_payable) < 0;

    return (
        <div className="min-h-screen bg-slate-50">
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

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

                {/* Summary cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Sales VAT</p>
                        <p className="mt-2 text-2xl font-semibold text-teal-600">
                            {Number(report.sales_vat_amount).toFixed(2)} €
                        </p>
                        <p className="mt-1 text-xs text-slate-500">Net {Number(report.sales_net).toFixed(2)} €</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Purchase VAT</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-700">
                            {Number(report.purchase_vat_amount).toFixed(2)} €
                        </p>
                        <p className="mt-1 text-xs text-slate-500">Net {Number(report.purchase_net).toFixed(2)} €</p>
                    </div>
                    <div className={`rounded-xl border p-5 shadow-sm ${
                        isRefund
                            ? "border-teal-200 bg-teal-50"
                            : "border-rose-200 bg-rose-50"
                    }`}>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            {isRefund ? "VAT Refund" : "VAT Payable"}
                        </p>
                        <p className={`mt-2 text-2xl font-semibold ${isRefund ? "text-teal-700" : "text-rose-600"}`}>
                            {Math.abs(Number(report.vat_payable)).toFixed(2)} €
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            {isRefund ? "Verohallinto refunds you" : "Pay to Verohallinto"}
                        </p>
                    </div>
                </div>

                {/* Sales VAT breakdown */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <h2 className="font-semibold text-slate-900">Sales VAT breakdown</h2>
                        <p className="text-xs text-slate-500 mt-0.5">VAT collected from your customers</p>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-left">
                                <th className="px-5 py-3 font-medium text-slate-500">VAT rate</th>
                                <th className="px-5 py-3 font-medium text-slate-500 text-right">Net</th>
                                <th className="px-5 py-3 font-medium text-slate-500 text-right">VAT amount</th>
                                <th className="px-5 py-3 font-medium text-slate-500 text-right">Gross</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {vatBreakdown.sales.map((row) => (
                                <tr key={row.rate}>
                                    <td className="px-5 py-3 font-medium text-slate-900">{row.rate}%</td>
                                    <td className="px-5 py-3 text-right text-slate-600">{row.net.toFixed(2)} €</td>
                                    <td className="px-5 py-3 text-right font-medium text-teal-700">{row.vat_amount.toFixed(2)} €</td>
                                    <td className="px-5 py-3 text-right text-slate-600">{row.gross.toFixed(2)} €</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                                <td className="px-5 py-3 text-slate-900">Total</td>
                                <td className="px-5 py-3 text-right text-slate-900">{Number(report.sales_net).toFixed(2)} €</td>
                                <td className="px-5 py-3 text-right text-teal-700">{Number(report.sales_vat_amount).toFixed(2)} €</td>
                                <td className="px-5 py-3 text-right text-slate-900">{Number(report.sales_gross).toFixed(2)} €</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Purchase VAT breakdown */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <h2 className="font-semibold text-slate-900">Purchase VAT breakdown</h2>
                        <p className="text-xs text-slate-500 mt-0.5">VAT deductible from your purchases</p>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-left">
                                <th className="px-5 py-3 font-medium text-slate-500">VAT rate</th>
                                <th className="px-5 py-3 font-medium text-slate-500 text-right">Net</th>
                                <th className="px-5 py-3 font-medium text-slate-500 text-right">VAT amount</th>
                                <th className="px-5 py-3 font-medium text-slate-500 text-right">Gross</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {vatBreakdown.purchases.map((row) => (
                                <tr key={row.rate}>
                                    <td className="px-5 py-3 font-medium text-slate-900">{row.rate}%</td>
                                    <td className="px-5 py-3 text-right text-slate-600">{row.net.toFixed(2)} €</td>
                                    <td className="px-5 py-3 text-right font-medium text-slate-700">{row.vat_amount.toFixed(2)} €</td>
                                    <td className="px-5 py-3 text-right text-slate-600">{row.gross.toFixed(2)} €</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                                <td className="px-5 py-3 text-slate-900">Total</td>
                                <td className="px-5 py-3 text-right text-slate-900">{Number(report.purchase_net).toFixed(2)} €</td>
                                <td className="px-5 py-3 text-right text-slate-700">{Number(report.purchase_vat_amount).toFixed(2)} €</td>
                                <td className="px-5 py-3 text-right text-slate-900">{Number(report.purchase_gross).toFixed(2)} €</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* VAT declaration toggle */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-900">VAT return submitted</p>
                        <p className="text-sm text-slate-500 mt-0.5">Mark this report as submitted to Verohallinto</p>
                    </div>
                    <button className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                        report.vat_declaration_sent
                            ? "bg-teal-600 text-white hover:bg-teal-700"
                            : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}>
                        {report.vat_declaration_sent ? "Submitted ✓" : "Mark as submitted"}
                    </button>
                </div>
            </div>
        </div>
    );
}