import DownloadButton from "./DownloadButton"
import Link from "next/link"

interface Props {
    report: any
}

export default function ReportRow({report}: Props) {
    return (
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
                    <DownloadButton id={report.id}/>
                </div>
            </td>
        </tr>
    );
};