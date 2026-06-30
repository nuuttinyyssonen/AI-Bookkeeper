export type ReceiptVat = {
  id: string;
  receipt_id: string;
  rate: number;
  net_amount: number;
  vat_amount: number;
  total: number;
};

export type Receipt = {
  id: string;
  vendor_name: string;
  receipt_date: string;
  total_amount: number | string;
  receiptVats?: ReceiptVat[];
  receipt_type: string;
  category?: { type: string; label: string } | null
  is_deductible: boolean;
  vat_deductibility_percentage?: number | null;
};

export const receipts: Receipt[] = [];

export function getReceiptById(id: string) {
  return receipts.find((receipt) => receipt.id === id);
}
