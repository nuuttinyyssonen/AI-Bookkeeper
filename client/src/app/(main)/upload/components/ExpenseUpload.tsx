"use client";

import { useTranslations } from "next-intl";
import UploadButtons from "./UploadButtons";

interface Props {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    isPending: boolean;
    runUpload: (files: File[], isIncome: boolean, clearFiles: () => void) => Promise<void>;
}

export default function ExpenseUpload({ handleChange, setSelectedFiles, selectedFiles, isPending, runUpload }: Props) {
    const t = useTranslations('expenseUpload');

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100">
                    <svg className="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">{t('title')}</p>
                    <p className="text-xs text-slate-500">{t('subtitle')}</p>
                </div>
            </div>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('selectFiles')}
                <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={handleChange}
                />
            </label>

            {selectedFiles.length > 0 && (
                <ul className="space-y-1 rounded-lg border border-slate-100 bg-slate-50 p-2">
                    {selectedFiles.map(file => (
                        <li key={`${file.name}-${file.size}`} className="flex items-center gap-2 truncate text-xs text-slate-600">
                            <span className="text-slate-400">📎</span>
                            {file.name}
                        </li>
                    ))}
                </ul>
            )}

            <UploadButtons
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                isPending={isPending}
                runUpload={runUpload}
                isIncome={false}
            />
        </div>
    );
}