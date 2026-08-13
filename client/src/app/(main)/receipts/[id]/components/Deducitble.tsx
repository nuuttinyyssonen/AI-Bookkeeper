"use client";

import { useTranslations } from 'next-intl';
import { useState } from "react";

interface Props {
    handleDeductibleToggle: () => void;
    isDeductible: boolean;
    deductiblePercentage: number;
    handleDeductiblePercentageChange: (value: number) => void | Promise<void>;
}

export default function Deductible({ handleDeductibleToggle, isDeductible, deductiblePercentage, handleDeductiblePercentageChange }: Props) {
    const t = useTranslations('deductible');
    const [customMode, setCustomMode] = useState(false);
    const [customValue, setCustomValue] = useState("");

    const isPreset = deductiblePercentage === 50 || deductiblePercentage === 100;

    const handlePreset = (pct: number) => {
        setCustomMode(false);
        setCustomValue("");
        handleDeductiblePercentageChange(pct);
    };

    const handleMuu = () => {
        setCustomMode(true);
        setCustomValue(isPreset ? "" : String(deductiblePercentage));
    };

    const handleCustomBlur = () => {
        const parsed = parseInt(customValue, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
            handleDeductiblePercentageChange(parsed);
        } else {
            setCustomValue(isPreset ? "" : String(deductiblePercentage));
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('label')}</span>
                <button
                    data-testid="deductible-toggle"
                    onClick={handleDeductibleToggle}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        isDeductible
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 hover:bg-red-200 hover:dark:bg-red-700"
                    }`}
                >
                    {isDeductible ? t('yes') : t('no')}
                </button>
            </div>
            {isDeductible && (
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{t('percentage')}</span>
                    <div className="flex gap-1.5 items-center">
                        {[50, 100].map(pct => (
                            <button
                                key={pct}
                                onClick={() => handlePreset(pct)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    !customMode && deductiblePercentage === pct
                                    ? "bg-teal-600 text-white"
                                    : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:dark:bg-slate-800"
                                }`}
                            >
                                {pct}%
                            </button>
                        ))}
                        <button
                            onClick={handleMuu}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                customMode
                                ? "bg-teal-600 text-white"
                                : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:dark:bg-slate-800"
                            }`}
                        >
                            {t('other')}
                        </button>
                        {customMode && (
                            <div className="flex items-center gap-1">
                                <input
                                    autoFocus
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={customValue}
                                    onChange={e => setCustomValue(e.target.value)}
                                    onBlur={handleCustomBlur}
                                    onKeyDown={e => e.key === "Enter" && handleCustomBlur()}
                                    placeholder="0–100"
                                    className="w-16 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-teal-500"
                                />
                                <span className="text-xs text-slate-500 dark:text-slate-400">%</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}