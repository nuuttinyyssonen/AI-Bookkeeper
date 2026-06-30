"use client";

import Categories from './Categories';
import ReceiptImage from './ReceiptImage';
import Header from './Header';
import Deductible from './Deducitble';
import Buttons from './Buttons';
import Vats from './Vats';
import ReceiptDetails from './ReceiptDetails';
import StatusCard from './StatusCard';

import { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { deleteReceiptById } from '../../action';
import { toast } from "sonner";
import { changeReceiptCategory, changeReceiptDeductible, changeReceiptDeductiblePercentage, updateReceiptDetails } from "../action";
import { useReceiptFile } from '@/hooks/useReceiptFile';
import { useReceipt } from '@/hooks/useReceipt';
import { type Receipt as ReceiptType } from '@/lib/receipts';

interface VatForm {
  id: string;
  rate: string;
  net_amount: string;
  vat_amount: string;
  total: string;
}

interface EditForm {
  vendor_name: string;
  total_amount: string;
  receipt_date: string;
}

function toDateInputValue(dateStr: string) {
  return new Date(dateStr).toISOString().split('T')[0];
}

function buildVatForms(receipt: ReceiptType): VatForm[] {
  return (receipt.receiptVats ?? []).map(v => ({
    id: v.id,
    rate: String(v.rate),
    net_amount: String(v.net_amount),
    vat_amount: String(v.vat_amount),
    total: String(v.total),
  }));
}

export default function Receipt() {
  const params = useParams();
  const receiptId = params?.id as string;

  const [deleted, setDeleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isDeductible, setIsDeductible] = useState<boolean>(true);
  const [deductiblePercentage, setDeductiblePercentage] = useState<number>(100);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<EditForm>({ vendor_name: '', total_amount: '', receipt_date: '' });
  const [vatForms, setVatForms] = useState<VatForm[]>([]);
  const [receiptData, setReceiptData] = useState<ReceiptType | null>(null);

  const { fileUrl, fileType, fileName, loadingFile, fileError } = useReceiptFile(receiptId);
  const { receipt, loading } = useReceipt(receiptId);

  useEffect(() => {
    if (receipt) {
      setSelectedCategory(receipt.category?.type ?? "");
      setIsDeductible(receipt.is_deductible ?? true);
      setDeductiblePercentage(receipt.vat_deductibility_percentage ?? 100);
      setReceiptData(receipt);
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

  const displayReceipt = receiptData ?? receipt;

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

  const handleDeductiblePercentageChange = async (value: number) => {
    setDeductiblePercentage(value);
    await changeReceiptDeductiblePercentage(receiptId, value);
  };

  const handleEdit = () => {
    setForm({
      vendor_name: displayReceipt.vendor_name,
      total_amount: String(displayReceipt.total_amount),
      receipt_date: toDateInputValue(displayReceipt.receipt_date),
    });
    setVatForms(buildVatForms(displayReceipt));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const result = await updateReceiptDetails(
      receiptId,
      form.vendor_name,
      parseFloat(form.total_amount),
      form.receipt_date,
      vatForms.map(v => ({
        id: v.id,
        rate: parseFloat(v.rate),
        net_amount: parseFloat(v.net_amount),
        vat_amount: parseFloat(v.vat_amount),
        total: parseFloat(v.total),
      }))
    );
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setReceiptData({
      ...displayReceipt,
      vendor_name: form.vendor_name,
      total_amount: parseFloat(form.total_amount),
      receipt_date: form.receipt_date,
      receiptVats: vatForms.map(v => ({
        id: v.id,
        receipt_id: receiptId,
        rate: parseFloat(v.rate),
        net_amount: parseFloat(v.net_amount),
        vat_amount: parseFloat(v.vat_amount),
        total: parseFloat(v.total),
      })),
    });

    toast.success("Receipt updated successfully");
    setIsEditing(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVatChange = (index: number, field: keyof Omit<VatForm, 'id'>, value: string) => {
    setVatForms(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <Header />
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <ReceiptDetails
              receipt={displayReceipt}
              isEditing={isEditing}
              form={form}
              handleChange={handleFormChange}
              handleEdit={handleEdit}
            />
            <CardContent>
              <div className="grid gap-6">
                <Vats
                  receipt={displayReceipt}
                  isEditing={isEditing}
                  vatForms={vatForms}
                  handleVatChange={handleVatChange}
                />
                <Categories
                  selectedCategory={selectedCategory}
                  handleCategoryChange={handleCategoryChange}
                />
                <Deductible
                  handleDeductibleToggle={handleDeductibleToggle}
                  isDeductible={isDeductible}
                  deductiblePercentage={deductiblePercentage}
                  handleDeductiblePercentageChange={handleDeductiblePercentageChange}
                />
              </div>
              <Buttons
                handleDelete={handleDelete}
                isEditing={isEditing}
                isLoading={isLoading}
                handleSave={handleSave}
                handleCancel={handleCancel}
              />
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
