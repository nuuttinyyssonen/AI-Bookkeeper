import { Receipt } from "@/lib/receipts";

interface Props {
    receipt: Receipt
}

export default function Vats({receipt}: Props) {
    return (
        <div className="space-y-3">
            {Array.isArray(receipt.receiptVats) && receipt.receiptVats.length > 0 ? (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold">VAT breakdown</div>
                {receipt.receiptVats.map((vat) => (
                <div key={vat.id} className="grid gap-2 sm:grid-cols-4">
                    <div>Rate: {vat.rate}%</div>
                    <div>Net: €{vat.net_amount.toFixed(2)}</div>
                    <div>VAT: €{vat.vat_amount.toFixed(2)}</div>
                    <div>Total: €{vat.total.toFixed(2)}</div>
                </div>
                ))}
            </div>
            ) : (
            <div className="text-sm text-slate-500">VAT details not available.</div>
            )}
        </div>
    );
};