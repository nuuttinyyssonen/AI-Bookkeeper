'use client';

import { useState, useMemo } from "react";
import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReceiptVat {
    id: string;
    receipt_id: string;
    rate: number;
    net_amount: number;
    vat_amount: number;
    total: number;
}

interface ReceiptDataItem {
    id: string;
    vendor_name: string;
    receipt_date: string;
    total_amount: number | string;
    receiptVats?: ReceiptVat[];
}

interface ReceiptDataProps {
    receiptList: ReceiptDataItem[];
}

export const ReceiptData = ({ receiptList }: ReceiptDataProps) => {
    const [query, setQuery] = useState("");

    const filtered = useMemo(
        () =>
            Array.isArray(receiptList)
                ? receiptList.filter(
                      (r) => typeof r.vendor_name === "string" && r.vendor_name.toLowerCase().includes(query.toLowerCase())
                  )
                : [],
        [receiptList, query]
    );

    return (
        <div>
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold">Receipts</h1>
                        <p className="mt-1 text-sm text-slate-600">Your uploaded receipts and parsed totals.</p>
                    </div>

                    <div className="flex w-full max-w-md items-center gap-3 lg:w-auto">
                        <Input
                            placeholder="Search vendor..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Button onClick={() => setQuery("")}>Clear</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {receiptList.map((r) => (
                        <Card key={r.id}>
                            <CardHeader>
                                <div>
                                    <CardTitle>{r.vendor_name}</CardTitle>
                                    <CardDescription>{new Date(r.receipt_date).toLocaleDateString()}</CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold">{r.total_amount}</div>
                                    {/* <div className="mt-1 text-xs text-slate-500">VAT: {r.vat}</div> */}
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    {Array.isArray(r.receiptVats) && r.receiptVats.length > 0 ? (
                                        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                            <div className="font-semibold">VAT breakdown</div>
                                            {r.receiptVats.map((vat) => (
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

                                <div className="mt-4 flex gap-2">
                        <Link
                            href={`/receipts/${r.id}`}
                            className="inline-flex flex-1 h-11 items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                        >
                            View
                        </Link>
                        <Button className="flex-1 bg-teal-600 text-white hover:bg-teal-700">Export</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="mt-8 rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center">
                        <h3 className="text-lg font-semibold">No receipts found</h3>
                        <p className="mt-2 text-sm text-slate-500">Try uploading a receipt or adjust your search.</p>
                    </div>
                )}
            </div>
        </div>
    )
};