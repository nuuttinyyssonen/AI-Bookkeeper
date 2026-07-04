"use client";

import { useTranslations } from "next-intl";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Receipt } from "@/lib/receipts";

interface EditForm {
    vendor_name: string;
    total_amount: string;
    receipt_date: string;
}

interface Props {
    receipt: Receipt;
    isEditing: boolean;
    form: EditForm;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEdit: () => void;
}

export default function ReceiptDetails({ receipt, isEditing, form, handleChange, handleEdit }: Props) {
    const t = useTranslations('receiptDetails');
    const inputClass = "w-full h-9 px-3 rounded-md border border-slate-300 text-sm text-slate-950 focus:outline-none focus:ring-1 focus:ring-teal-700";

    return (
        <CardHeader>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">{t('vendor')}</p>
                    {isEditing ? (
                        <input
                            name="vendor_name"
                            value={form.vendor_name}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    ) : (
                        <CardTitle>{receipt.vendor_name}</CardTitle>
                    )}
                </div>
                {!isEditing && (
                    <button
                        onClick={handleEdit}
                        className="h-9 px-4 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        {t('editReceipt')}
                    </button>
                )}
            </div>
            <div className="flex items-end justify-between mt-1">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">{t('date')}</p>
                    {isEditing ? (
                        <input
                            type="date"
                            name="receipt_date"
                            value={form.receipt_date}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    ) : (
                        <CardDescription>
                            {new Date(receipt.receipt_date).toLocaleDateString("fi-FI", { day: "numeric", month: "numeric", year: "numeric" })}
                        </CardDescription>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">{t('total')}</p>
                    {isEditing ? (
                        <input
                            type="number"
                            name="total_amount"
                            value={form.total_amount}
                            onChange={handleChange}
                            step="0.01"
                            className={`${inputClass} text-right`}
                        />
                    ) : (
                        <div className="text-lg font-semibold">{receipt.total_amount}</div>
                    )}
                </div>
            </div>
        </CardHeader>
    );
}