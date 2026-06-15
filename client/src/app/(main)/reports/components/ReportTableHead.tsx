export default function ReportTableHead() {
    return (
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
    );
};