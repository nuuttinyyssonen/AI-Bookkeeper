"use client";

import { useTranslations } from "next-intl";
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
    const t = useTranslations('vats');
    const inputClass = "w-full h-8 px-2 rounded-md border border-slate-300 dark:border-slate-600 text-sm text-slate-950 dark:text-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-700";
    const hasVats = Array.isArray(receipt.receiptVats) && receipt.receiptVats.length > 0;

    return (
        <div className="space-y-3">
            {hasVats ? (
                <div className="space-y-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 text-sm text-slate-700 dark:text-slate-200">
                    <div className="font-semibold">{t('breakdown')}</div>
                    {isEditing ? (
                        vatForms.map((vat, index) => (
                            <div key={vat.id} className="grid gap-2 sm:grid-cols-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">{t('rate')}</p>
                                    <input
                                        type="number"
                                        value={vat.rate}
                                        onChange={e => handleVatChange(index, 'rate', e.target.value)}
                                        step="0.01"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">{t('net')}</p>
                                    <input
                                        type="number"
                                        value={vat.net_amount}
                                        onChange={e => handleVatChange(index, 'net_amount', e.target.value)}
                                        step="0.01"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">{t('vat')}</p>
                                    <input
                                        type="number"
                                        value={vat.vat_amount}
                                        onChange={e => handleVatChange(index, 'vat_amount', e.target.value)}
                                        step="0.01"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">{t('total')}</p>
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
                                <div>{t('rateValue', { rate: vat.rate })}</div>
                                <div>{t('netValue', { amount: vat.net_amount.toFixed(2) })}</div>
                                <div>{t('vatValue', { amount: vat.vat_amount.toFixed(2) })}</div>
                                <div>{t('totalValue', { amount: vat.total.toFixed(2) })}</div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('notAvailable')}</div>
            )}
        </div>
    );
}