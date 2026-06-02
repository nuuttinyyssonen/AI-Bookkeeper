export type Receipt = {
  id: string;
  vendor_name: string;
  receipt_date: string;
  total_amount: string;
//   vat?: string;
};

export const receipts: Receipt[] = [];

export function getReceiptById(id: string) {
  return receipts.find((receipt) => receipt.id === id);
}
