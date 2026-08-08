"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Receipt } from "@/lib/receipts";
import { CardContent, CardDescription, CardHeader, CardTitle, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
    filtered: Receipt[];
}

export default function Receipts({ filtered }: Props) {
    const t = useTranslations('receipts');
    const tDemo = useTranslations('demo');

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
                <Card key={r.id} data-testid="receipt-card">
                    <CardHeader>
                        <div>
                            <CardTitle>{r.vendor_name}</CardTitle>
                            <CardDescription>{new Date(r.receipt_date).toLocaleDateString("fi-FI", {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                            })}</CardDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-semibold">{r.total_amount}</div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-3">
                            {Array.isArray(r.receiptVats) && r.receiptVats.length > 0 ? (
                                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                    <div className="font-semibold">{t('vatBreakdown')}</div>
                                    {r.receiptVats.map((vat) => (
                                        <div key={vat.id} className="grid gap-2 sm:grid-cols-4">
                                            <div>{t('rateValue', { rate: vat.rate })}</div>
                                            <div>{t('netValue', { amount: vat.net_amount.toFixed(2) })}</div>
                                            <div>{t('vatValue', { amount: vat.vat_amount.toFixed(2) })}</div>
                                            <div>{t('totalValue', { amount: vat.total.toFixed(2) })}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-slate-500">{t('vatNotAvailable')}</div>
                            )}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-slate-500">
                                {r.category?.label ?? t('noCategory')}
                            </span>
                            <span className={`font-medium ${r.is_deductible ? "text-teal-600" : "text-red-500"}`}>
                                {r.is_deductible ? t('deductible') : t('notDeductible')}
                            </span>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Link
                                href={`/receipts/${r.id}`}
                                className="inline-flex flex-1 h-11 items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                            >
                                {t('view')}
                            </Link>
                            <Button
                                onClick={() => toast.error(tDemo('exportBlocked'))}
                                className="flex-1 bg-teal-600 text-white hover:bg-teal-700"
                            >
                                {t('export')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}