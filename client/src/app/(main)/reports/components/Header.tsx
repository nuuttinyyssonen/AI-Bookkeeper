'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createReport } from "../action";

interface Props {
    reports: any[];
    setReports: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function Header({reports, setReports}: Props) {
    const t = useTranslations('reportsHeader');
    const [isOpen, setIsOpen] = useState(false);
    const [timePeriod, setTimePeriod] = useState("Q1");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async () => {
        setIsPending(true);
        const result = await createReport(timePeriod);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success(t('generateSuccess'));
            setReports(prev => {
                const exists = prev.some(r => r.id === result.data.id);
                return exists
                    ? prev.map(r => (r.id === result.data.id ? result.data : r))
                    : [result.data, ...prev];
            });
            setIsOpen(false);
        }
        setIsPending(false);
    };
    return (
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-teal-700">{t('eyebrow')}</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {t('title')}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {t('description')}
                    </p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                >
                    {t('newReport')}
                </button>

                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="rounded-xl bg-white p-6 shadow-xl w-full max-w-sm">
                            <h2 className="text-lg font-semibold text-slate-900">{t('modalTitle')}</h2>
                            <p className="mt-1 text-sm text-slate-500">{t('modalDescription')}</p>

                            <select
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(e.target.value)}
                                className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                            >
                                <option value="Q1">{t('periodQ1')}</option>
                                <option value="Q2">{t('periodQ2')}</option>
                                <option value="Q3">{t('periodQ3')}</option>
                                <option value="Q4">{t('periodQ4')}</option>
                                <option value="Monthly">{t('periodMonthly')}</option>
                                <option value="YEARLY">{t('periodYearly')}</option>
                            </select>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isPending}
                                    className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                                >
                                    {isPending ? t('generating') : t('generate')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};