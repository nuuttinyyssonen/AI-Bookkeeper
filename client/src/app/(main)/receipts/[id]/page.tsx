"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Receipt } from "@/lib/receipts";
import { getReceiptById, deleteReceiptById, getReceiptFile } from "../action";

export default function ReceiptDetailPage() {
  const params = useParams();
  const receiptId = params?.id as string | undefined;
  const [deleted, setDeleted] = React.useState(false);
  const [receipt, setReceipt] = React.useState<Receipt | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);
  const [fileType, setFileType] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [loadingFile, setLoadingFile] = React.useState(true);
  const [fileError, setFileError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!receiptId) {
      setLoading(false);
      return;
    }

    const fetchReceipt = async () => {
      const data = await getReceiptById(receiptId);
      setReceipt(data?.receipt || null);
      setLoading(false);
    };

    fetchReceipt();
  }, [receiptId]);

  React.useEffect(() => {
    if (!receiptId) {
      setLoadingFile(false);
      return;
    }

    let objectUrl: string | null = null;

    const fetchFile = async () => {
      setLoadingFile(true);
      setFileError(null);

      const fileData = await getReceiptFile(receiptId);
      if (!fileData) {
        setFileError("Unable to load receipt preview.");
        setLoadingFile(false);
        return;
      }

      const binary = Uint8Array.from(atob(fileData.base64), (char) => char.charCodeAt(0));
      const blob = new Blob([binary], { type: fileData.contentType });
      objectUrl = URL.createObjectURL(blob);

      setFileUrl(objectUrl);
      setFileType(fileData.contentType);
      setFileName(fileData.filename);
      setLoadingFile(false);
    };

    fetchFile();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [receiptId]);

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Loading...</p>
        </div>
      </div>
    );
  }

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

  const handleDelete = async() => {
    await deleteReceiptById(receiptId);
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
                <CardDescription>{new Date(receipt.receipt_date).toLocaleDateString("fi-FI", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{receipt.total_amount}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Document ID</p>
                  <p className="text-base font-medium text-slate-900">{receipt.id}</p>
                </div>

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
              {loadingFile ? (
                <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-sm text-slate-500">
                  Loading receipt preview...
                </div>
              ) : fileError ? (
                <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-sm text-slate-500">
                  {fileError}
                </div>
              ) : fileUrl ? (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                  {fileType?.includes("pdf") ? (
                    <iframe
                      src={fileUrl}
                      title={fileName ?? "Receipt PDF"}
                      className="h-96 w-full"
                    />
                  ) : (
                    <img
                      src={fileUrl}
                      alt={`Receipt file ${fileName ?? "preview"}`}
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-sm text-slate-500">
                  No preview available.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
