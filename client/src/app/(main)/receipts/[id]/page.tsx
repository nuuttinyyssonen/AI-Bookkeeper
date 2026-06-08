"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Receipt } from "@/lib/receipts";
import { getReceiptById, deleteReceiptById, getReceiptFile } from "../action";
import { toast } from "sonner";
import { changeReceiptCategory, changeReceiptDeductible } from "./action";

const CATEGORIES = [
  { type: "TOIMISTOKULUT",              label: "Toimistokulut" },
  { type: "MATKAKULUT",                 label: "Matkakulut" },
  { type: "EDUSTUSKULUT",               label: "Edustuskulut" },
  { type: "ATERIA",                     label: "Ateria" },
  { type: "MARKKINOINTI_JA_MAINONTA",   label: "Markkinointi ja mainonta" },
  { type: "KALUSTO_JA_LAITTEET",        label: "Kalusto ja laitteet" },
  { type: "PALKKAKULUT_JA_PALKKIOT",    label: "Palkkakulut ja palkkiot" },
  { type: "VUOKRA",                     label: "Vuokra" },
  { type: "VAKUUTUKSET",                label: "Vakuutukset" },
  { type: "PUHELIN_JA_TIETOLIIKENNE",   label: "Puhelin ja tietoliikenne" },
  { type: "OHJELMISTOT_JA_LISENSSIT",   label: "Ohjelmistot ja lisenssit" },
  { type: "KOULUTUS_JA_KURSSIT",        label: "Koulutus ja kurssit" },
  { type: "KIRJANPITO_JA_LAKIPALVELUT", label: "Kirjanpito ja lakipalvelut" },
  { type: "PANKKIKULUT",                label: "Pankkikulut" },
  { type: "AJONEUVOKULUT",              label: "Ajoneuvokulut" },
  { type: "KOTITOIMISTON_KULUT",        label: "Kotitoimiston kulut" },
  { type: "YKSITYISOTOT",               label: "Yksityisotot" },
  { type: "MUUT_KULUT",                 label: "Muut kulut" },
  { type: "MYYNTI_TUOTTEET",            label: "Myynti — tuotteet" },
  { type: "MYYNTI_PALVELUT",            label: "Myynti — palvelut" },
  { type: "MUUT_TULOT",                 label: "Muut tulot" },
];

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

  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [isDeductible, setIsDeductible] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (receipt) {
      setSelectedCategory(receipt.category?.type ?? "");
      setIsDeductible(receipt.is_deductible ?? true);
    }
  }, [receipt]);

  React.useEffect(() => {
    if(deleted) toast.success("File deleted successfully");
  }, [deleted]);

  React.useEffect(() => {
    if (!receiptId) { setLoading(false); return; }
    const fetchReceipt = async () => {
      const data = await getReceiptById(receiptId);
      setReceipt(data?.receipt || null);
      setLoading(false);
    };
    fetchReceipt();
  }, [receiptId]);

  React.useEffect(() => {
    if (!receiptId) { setLoadingFile(false); return; }
    let objectUrl: string | null = null;
    const fetchFile = async () => {
      setLoadingFile(true);
      setFileError(null);
      const fileData = await getReceiptFile(receiptId);
      if (!fileData) { setFileError("Unable to load receipt preview."); setLoadingFile(false); return; }
      const binary = Uint8Array.from(atob(fileData.base64), (char) => char.charCodeAt(0));
      const blob = new Blob([binary], { type: fileData.contentType });
      objectUrl = URL.createObjectURL(blob);
      setFileUrl(objectUrl);
      setFileType(fileData.contentType);
      setFileName(fileData.filename);
      setLoadingFile(false);
    };
    fetchFile();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [receiptId]);

  if (loading) return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-lg font-semibold text-slate-900">Loading...</p>
      </div>
    </div>
  );

  if (!receipt) return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-lg font-semibold text-slate-900">Receipt not found</p>
        <p className="mt-2 text-sm text-slate-500">The receipt you are looking for does not exist.</p>
        <Link href="/receipts" className="mt-6 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Back to receipts</Link>
      </div>
    </div>
  );

  if (deleted) return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <p className="text-lg font-semibold text-slate-900">Receipt deleted</p>
        <p className="mt-2 text-sm text-slate-500">This receipt has been removed from your list.</p>
        <Link href="/receipts" className="mt-6 inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">Back to receipts</Link>
      </div>
    </div>
  );

  const handleDelete = async () => {
    await deleteReceiptById(receiptId);
    setDeleted(true);
  };

  const handleCategoryChange = async (type: string) => {
    setSelectedCategory(type);
    await changeReceiptCategory(receiptId!, type);
  };

  const handleDeductibleToggle = async () => {
    const newValue = !isDeductible;
    setIsDeductible(newValue);
    await changeReceiptDeductible(receiptId!, newValue);
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
                <CardDescription>{new Date(receipt.receipt_date).toLocaleDateString("fi-FI", { day: "numeric", month: "numeric", year: "numeric" })}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{receipt.total_amount}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
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

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Kategoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  >
                    <option value="" disabled>Valitse kategoria</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.type} value={c.type}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Deductibility */}
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">Vähennyskelpoinen</span>
                  <button
                    onClick={handleDeductibleToggle}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      isDeductible
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {isDeductible ? "Kyllä" : "Ei"}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>Delete receipt</Button>
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
                <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-sm text-slate-500">Loading receipt preview...</div>
              ) : fileError ? (
                <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-sm text-slate-500">{fileError}</div>
              ) : fileUrl ? (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                  {fileType?.includes("pdf") ? (
                    <iframe src={fileUrl} title={fileName ?? "Receipt PDF"} className="h-96 w-full" />
                  ) : (
                    <img src={fileUrl} alt={`Receipt file ${fileName ?? "preview"}`} className="h-full w-full object-contain" />
                  )}
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-sm text-slate-500">No preview available.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}