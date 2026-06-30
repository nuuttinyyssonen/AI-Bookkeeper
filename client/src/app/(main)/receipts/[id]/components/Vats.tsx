import { Receipt } from "@/lib/receipts";

interface VatForm {
    id: string;
    rate: string;
    net_amount: string;
    vat_amount: string;
    total: string;
}

interface Props {
    receipt: Receipt;
    isEditing: boolean;
    vatForms: VatForm[];
    handleVatChange: (index: number, field: keyof Omit<VatForm, 'id'>, value: string) => void;
}

export default function Vats({ receipt, isEditing, vatForms, handleVatChange }: Props) {
    const inputClass = "w-full h-8 px-2 rounded-md border border-slate-300 text-sm text-slate-950 focus:outline-none focus:ring-1 focus:ring-teal-700";

    const hasVats = Array.isArray(receipt.receiptVats) && receipt.receiptVats.length > 0;

    return (
        <div className="space-y-3">
            {hasVats ? (
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="font-semibold">VAT breakdown</div>
                    {isEditing ? (
                        vatForms.map((vat, index) => (
                            <div key={vat.id} className="grid gap-2 sm:grid-cols-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Rate %</p>
                                    <input
                                        type="number"
                                        value={vat.rate}
                                        onChange={e => handleVatChange(index, 'rate', e.target.value)}
                                        step="0.01"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Net €</p>
                                    <input
                                        type="number"
                                        value={vat.net_amount}
                                        onChange={e => handleVatChange(index, 'net_amount', e.target.value)}
                                        step="0.01"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">VAT €</p>
                                    <input
                                        type="number"
                                        value={vat.vat_amount}
                                        onChange={e => handleVatChange(index, 'vat_amount', e.target.value)}
                                        step="0.01"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Total €</p>
                                    <input
                                        type="number"
                                        value={vat.total}
                                        onChange={e => handleVatChange(index, 'total', e.target.value)}
                                        step="0.01"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        receipt.receiptVats!.map((vat) => (
                            <div key={vat.id} className="grid gap-2 sm:grid-cols-4">
                                <div>Rate: {vat.rate}%</div>
                                <div>Net: €{vat.net_amount.toFixed(2)}</div>
                                <div>VAT: €{vat.vat_amount.toFixed(2)}</div>
                                <div>Total: €{vat.total.toFixed(2)}</div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="text-sm text-slate-500">VAT details not available.</div>
            )}
        </div>
    );
};
