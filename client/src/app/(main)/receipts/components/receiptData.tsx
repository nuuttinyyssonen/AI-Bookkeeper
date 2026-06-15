'use client';

import Receipts from "./receipts";
import ReceiptsHeader from "./ReceiptsHeader";
import ReceiptTabs from "./ReceiptTabs";
import ReceiptsEmpty from "./ReceiptsEmpty";

import { useState, useMemo, useEffect } from "react";
import { Receipt } from "@/lib/receipts";
import { ReceiptsResponse } from "../action";

interface ReceiptDataProps {
    receiptList: Receipt[];
    is_documents_processing: boolean;
    is_documents_pending: boolean;
    fetchReceipts: () => Promise<ReceiptsResponse>;
}

export const ReceiptData = ({ receiptList, is_documents_processing, is_documents_pending, fetchReceipts }: ReceiptDataProps) => {
    const [query, setQuery] = useState("");
    const [receipts, setReceipts] = useState(receiptList);
    const [isProcessing, setIsProcessing] = useState(is_documents_processing);
    const [isPending, setIsPending] = useState(is_documents_pending);
    const [activeTab, setActiveTab] = useState<"EXPENSE" | "INCOME">("EXPENSE");

    useEffect(() => {
        if (!isProcessing && !isPending) return;

        const interval = setInterval(async () => {
            const data = await fetchReceipts();
            setReceipts(data.receipts);
            setIsProcessing(data.is_documents_processing);
            setIsPending(data.is_documents_pending);

            if (!data.is_documents_processing && !data.is_documents_pending) {
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const filtered = useMemo(
        () =>
            Array.isArray(receipts)
                ? receipts.filter(
                      (r) =>
                          r.receipt_type === activeTab &&
                          typeof r.vendor_name === "string" &&
                          r.vendor_name.toLowerCase().includes(query.toLowerCase())
                  )
                : [],
        [receipts, query, activeTab]
    );

    const expenseCount = receipts.filter(r => r.receipt_type === "EXPENSE").length;
    const incomeCount = receipts.filter(r => r.receipt_type === "INCOME").length;

    return (
        <div>
            <div className="mx-auto max-w-7xl">
                <ReceiptsHeader
                    isProcessing={isProcessing}
                    query={query}
                    setQuery={setQuery}
                />
                <ReceiptTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    expenseCount={expenseCount}
                    incomeCount={incomeCount}
                />
                <Receipts filtered={filtered} />
                <ReceiptsEmpty filtered={filtered} />
            </div>
        </div>
    );
};