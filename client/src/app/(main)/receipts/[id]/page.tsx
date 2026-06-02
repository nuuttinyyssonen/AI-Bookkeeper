"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getReceiptById, type Receipt } from "@/lib/receipts";

export default function ReceiptDetailPage() {
  const params = useParams();
  const receiptId = params?.id as string | undefined;
  const [deleted, setDeleted] = React.useState(false);
  const receipt = React.useMemo(() => (receiptId ? getReceiptById(receiptId) : undefined), [receiptId]);

  if (!receipt) {
    return (
      <div className="px-6 py-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Receipt not found</p>
          <p className="mt-2 text-sm text-slate-500">The receipt you are looking for does not exist.</p>
          <Link href="/receipts" className="mt-6 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to receipts
          </Link>
        </div>
      </div>
    );
  }

  if (deleted) {
    return (
      <div className="px-6 py-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <p className="text-lg font-semibold text-slate-900">Receipt deleted</p>
          <p className="mt-2 text-sm text-slate-500">This receipt has been removed from your list.</p>
          <Link href="/receipts" className="mt-6 inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
            Back to receipts
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    setDeleted(true);
  };

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Receipt details</h1>
            <p className="mt-1 text-sm text-slate-600">Review the full receipt, image, and action options.</p>
          </div>
          <Link href="/receipts" className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-50">
            Back to receipts
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{receipt.vendor_name}</CardTitle>
                <CardDescription>{new Date(receipt.receipt_date).toLocaleDateString()}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{receipt.total_amount}</div>
                {/* <div className="mt-1 text-xs text-slate-500">VAT: {receipt.vat}</div> */}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Document ID</p>
                  <p className="text-base font-medium text-slate-900">{receipt.id}</p>
                </div>

                {/* <div className="grid gap-2 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="text-base font-medium text-slate-900">{receipt.category}</p>
                </div> */}

                {/* <div className="grid gap-2 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Notes</p>
                  <p className="text-base font-medium text-slate-900">{receipt.note}</p>
                </div> */}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
                  Delete receipt
                </Button>
                <Button className="bg-teal-600 text-white hover:bg-teal-700">Download PDF</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receipt image</CardTitle>
              <CardDescription>Preview the uploaded receipt for this entry.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                <img
                  src={receipt.imageUrl}
                  alt={`Receipt from ${receipt.vendor}`}
                  className="h-full w-full object-cover"
                />
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
