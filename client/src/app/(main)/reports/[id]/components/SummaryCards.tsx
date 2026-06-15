interface Props {
    report: any,
    isRefund: boolean
};

export default function SummaryCards({report, isRefund}: Props) {
    return (
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
    );
};