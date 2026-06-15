"use client";

import Categories from './components/Categories';
import ReceiptImage from './components/ReceiptImage';
import Header from './components/Header';
import Deductible from './components/Deducitble';
import Buttons from './components/Buttons';
import Vats from './components/Vats';
import ReceiptDetails from './components/ReceiptDetails';

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { type Receipt } from "@/lib/receipts";
import { getReceiptById, deleteReceiptById, getReceiptFile } from "../action";
import { toast } from "sonner";
import { changeReceiptCategory, changeReceiptDeductible } from "./action";

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
        <Header />
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <ReceiptDetails receipt={receipt} />
            <CardContent>
              <div className="grid gap-6">
                <Vats receipt={receipt} />
                <Categories 
                  selectedCategory={selectedCategory} 
                  handleCategoryChange={handleCategoryChange} 
                />
                <Deductible 
                  handleDeductibleToggle={handleDeductibleToggle}
                  isDeductible={isDeductible}
                />
              </div>
              <Buttons handleDelete={handleDelete}/>
            </CardContent>
          </Card>
          <ReceiptImage 
            loadingFile={loadingFile}
            fileError={fileError}
            fileUrl={fileUrl}
            fileType={fileType}
            fileName={fileName}
          />
        </div>
      </div>
    </div>
  );
}