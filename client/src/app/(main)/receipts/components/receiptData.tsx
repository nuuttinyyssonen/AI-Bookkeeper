'use client';

import Receipts from "./receipts";
import ReceiptsHeader from "./ReceiptsHeader";
import ReceiptTabs from "./ReceiptTabs";
import ReceiptsEmpty from "./ReceiptsEmpty";

import { useState, useEffect, useRef } from "react";
import { getReceipts, ReceiptsResponse } from "../action";

interface ReceiptDataProps {
    initialData: ReceiptsResponse;
}

export const ReceiptData = ({ initialData }: ReceiptDataProps) => {
    const [receipts, setReceipts] = useState(initialData.receipts);
    const [page, setPage] = useState(initialData.page);
    const [totalPages, setTotalPages] = useState(initialData.totalPages);
    const [expenseTotal, setExpenseTotal] = useState(initialData.expenseTotal);
    const [incomeTotal, setIncomeTotal] = useState(initialData.incomeTotal);
    const [isProcessing, setIsProcessing] = useState(initialData.is_documents_processing);
    const [isPending, setIsPending] = useState(initialData.is_documents_pending);
    const [activeTab, setActiveTab] = useState<"EXPENSE" | "INCOME">("EXPENSE");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    // Keep a ref to current params so polling always uses the latest values without stale closures
    const paramsRef = useRef({ page, search, activeTab, from, to });
    useEffect(() => {
        paramsRef.current = { page, search, activeTab, from, to };
    }, [page, search, activeTab, from, to]);

    // Debounce search input by 400ms before triggering a fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const updateState = (data: ReceiptsResponse) => {
        setReceipts(data.receipts);
        setTotalPages(data.totalPages);
        setExpenseTotal(data.expenseTotal);
        setIncomeTotal(data.incomeTotal);
        setIsProcessing(data.is_documents_processing);
        setIsPending(data.is_documents_pending);
    };

    // Refetch from server whenever filters or page change
    useEffect(() => {
        getReceipts({
            page,
            search: search || undefined,
            type: activeTab,
            from: from || undefined,
            to: to || undefined,
        }).then(updateState);
    }, [page, search, activeTab, from, to]);

    // Poll every 2s while documents are still being processed
    useEffect(() => {
        if (!isProcessing && !isPending) return;

        const interval = setInterval(async () => {
            const { page: p, search: s, activeTab: t, from: f, to: to_ } = paramsRef.current;
            const data = await getReceipts({
                page: p,
                search: s || undefined,
                type: t,
                from: f || undefined,
                to: to_ || undefined,
            });
            updateState(data);
            if (!data.is_documents_processing && !data.is_documents_pending) {
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isProcessing, isPending]);

    const handleTabChange = (tab: "EXPENSE" | "INCOME") => {
        setActiveTab(tab);
        setPage(1);
    };

    const handleClear = () => {
        setSearchInput("");
        setSearch("");
        setFrom("");
        setTo("");
        setPage(1);
    };

    return (
        <div>
            <div className="mx-auto max-w-7xl">
                <ReceiptsHeader
                    isProcessing={isProcessing}
                    query={searchInput}
                    setQuery={setSearchInput}
                    from={from}
                    setFrom={(val) => { setFrom(val); setPage(1); }}
                    to={to}
                    setTo={(val) => { setTo(val); setPage(1); }}
                    onClear={handleClear}
                />
                <ReceiptTabs
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                    expenseCount={expenseTotal}
                    incomeCount={incomeTotal}
                />
                <Receipts filtered={receipts} />
                <ReceiptsEmpty filtered={receipts} />

                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            className="h-8 px-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-60 disabled:pointer-events-none"
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page <= 1}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="h-8 px-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-60 disabled:pointer-events-none"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
