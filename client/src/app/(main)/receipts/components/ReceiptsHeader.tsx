"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { downloadReceiptsExcel } from "@/lib/exportReceipt";

interface Props {
    isProcessing: boolean;
    query: string;
    setQuery: (query: string) => void;
    from: string;
    setFrom: (from: string) => void;
    to: string;
    setTo: (to: string) => void;
    onClear: () => void;
    activeTab: "EXPENSE" | "INCOME";
}

export default function ReceiptsHeader({ isProcessing, query, setQuery, from, setFrom, to, setTo, onClear, activeTab }: Props) {
    const t = useTranslations('receiptsHeader');

    const handleExport = () => {
        downloadReceiptsExcel({
            type: activeTab,
            from: from || undefined,
            to: to || undefined,
            search: query || undefined,
        });
    };

    return (
        <div className="mb-6 flex flex-col gap-4">
            <div>
                <h1 className="text-3xl font-semibold">{t('title')}</h1>
                <p className="mt-1 text-sm text-slate-600">{t('description')}</p>
                {isProcessing && (
                    <p className="mt-1 text-sm text-teal-600 animate-pulse">{t('processing')}</p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Input
                    className="w-56"
                    placeholder={t('search')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="h-9 rounded-md border border-slate-200 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-400">{t('to')}</span>
                <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="h-9 rounded-md border border-slate-200 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                    className="h-9 px-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                    onClick={onClear}
                >
                    {t('clear')}
                </button>
                <button
                    className="h-9 px-3 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                    onClick={handleExport}
                >
                    {t('exportExcel')}
                </button>
            </div>
        </div>
    );
}