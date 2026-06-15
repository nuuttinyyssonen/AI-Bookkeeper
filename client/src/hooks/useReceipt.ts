// hooks/useReceipt.ts
import { useState, useEffect } from "react";
import { getReceiptById } from "@/app/(main)/receipts/action";
import { type Receipt } from "@/lib/receipts";

export function useReceipt(receiptId: string | undefined) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!receiptId) { setLoading(false); return; }
    const fetch = async () => {
      const data = await getReceiptById(receiptId);
      setReceipt(data?.receipt || null);
      setLoading(false);
    };
    fetch();
  }, [receiptId]);

  return { receipt, loading };
}