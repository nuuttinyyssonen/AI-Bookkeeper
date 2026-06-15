"use client";

import Categories from './components/Categories';
import ReceiptImage from './components/ReceiptImage';
import Header from './components/Header';
import Deductible from './components/Deducitble';
import Buttons from './components/Buttons';
import Vats from './components/Vats';
import ReceiptDetails from './components/ReceiptDetails';
import StatusCard from './components/StatusCard';

import { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { deleteReceiptById } from "../action";
import { toast } from "sonner";
import { changeReceiptCategory, changeReceiptDeductible } from "./action";
import { useReceiptFile } from '@/hooks/useReceiptFile';
import { useReceipt } from '@/hooks/useReceipt';

export default function ReceiptDetailPage() {
  const params = useParams();
  const receiptId = params?.id as string;

  const [deleted, setDeleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isDeductible, setIsDeductible] = useState<boolean>(true);

  // Custom hooks that retrieve receipt and file data.
  const { fileUrl, fileType, fileName, loadingFile, fileError } = useReceiptFile(receiptId);
  const { receipt, loading } = useReceipt(receiptId);

  useEffect(() => {
    if (receipt) {
      setSelectedCategory(receipt.category?.type ?? "");
      setIsDeductible(receipt.is_deductible ?? true);
    }
  }, [receipt]);

  if (loading) return <StatusCard title="Loading..." />;

  if (!receipt) return (
    <StatusCard
      title="Receipt not found"
      description="The receipt you are looking for does not exist."
      link={{ href: "/receipts", label: "Back to receipts" }}
    />
  );

  if (deleted) return (
    <StatusCard
      title="Receipt deleted"
      description="This receipt has been removed from your list."
      link={{ href: "/receipts", label: "Back to receipts", className: "bg-teal-600 hover:bg-teal-700" }}
      centered
    />
  );

  const handleDelete = async () => {
    await deleteReceiptById(receiptId);
    toast.success("File deleted successfully");
    setDeleted(true);
  };

  const handleCategoryChange = async (type: string) => {
    setSelectedCategory(type);
    await changeReceiptCategory(receiptId, type);
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