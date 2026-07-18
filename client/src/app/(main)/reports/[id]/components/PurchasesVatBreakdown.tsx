'use client';

import { useTranslations } from "next-intl";
import { VatBreakdown, VatReport } from "@/app/types/report";

interface Props {
    vatBreakdown: VatBreakdown,
    report: VatReport
}

export default function PurchasesVatBreakdown({vatBreakdown, report}: Props) {
    const t = useTranslations('purchasesVatBreakdown');

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="font-semibold text-slate-900">{t('title')}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{t('description')}</p>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-left">
                        <th className="px-5 py-3 font-medium text-slate-500">{t('vatRate')}</th>
                        <th className="px-5 py-3 font-medium text-slate-500 text-right">{t('net')}</th>
                        <th className="px-5 py-3 font-medium text-slate-500 text-right">{t('vatAmount')}</th>
                        <th className="px-5 py-3 font-medium text-slate-500 text-right">{t('gross')}</th>
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
                        <td className="px-5 py-3 text-slate-900">{t('total')}</td>
                        <td className="px-5 py-3 text-right text-slate-900">{Number(report.purchase_net).toFixed(2)} €</td>
                        <td className="px-5 py-3 text-right text-slate-700">{Number(report.purchase_vat_amount).toFixed(2)} €</td>
                        <td className="px-5 py-3 text-right text-slate-900">{Number(report.purchase_gross).toFixed(2)} €</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};