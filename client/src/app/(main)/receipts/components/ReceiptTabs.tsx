"use client";

import { useTranslations } from "next-intl";

interface ReceiptTabsProps {
    activeTab: "EXPENSE" | "INCOME";
    setActiveTab: (tab: "EXPENSE" | "INCOME") => void;
    expenseCount: number;
    incomeCount: number;
}

export default function ReceiptTabs({ activeTab, setActiveTab, expenseCount, incomeCount }: ReceiptTabsProps) {
    const t = useTranslations('receiptTabs');

    return (
        <div className="mb-6 flex gap-2 border-b border-slate-200">
            <button
                onClick={() => setActiveTab("EXPENSE")}
                className={`pb-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === "EXPENSE"
                        ? "border-b-2 border-slate-950 text-slate-950"
                        : "text-slate-500 hover:text-slate-700"
                }`}
            >
                {t('expenses', { count: expenseCount })}
            </button>
            <button
                onClick={() => setActiveTab("INCOME")}
                className={`pb-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === "INCOME"
                        ? "border-b-2 border-teal-600 text-teal-600"
                        : "text-slate-500 hover:text-slate-700"
                }`}
            >
                {t('income', { count: incomeCount })}
            </button>
        </div>
    );
}