"use client";

import { useTranslations } from "next-intl";

interface Props {
    isPending: boolean;
    isIncome: boolean;
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    runUpload: (files: File[], isIncome: boolean, clearFiles: () => void) => Promise<void>;
}

export default function UploadButtons({ isPending, selectedFiles, setSelectedFiles, runUpload, isIncome }: Props) {
    const t = useTranslations('uploadButtons');

    return (
        <div className="flex gap-2">
            <button
                type="button"
                disabled={isPending || selectedFiles.length === 0}
                onClick={() => runUpload(selectedFiles, isIncome, () => setSelectedFiles([]))}
                className="flex-1 rounded-lg bg-slate-900 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 hover:dark:bg-slate-700 disabled:opacity-40"
            >
                {isPending ? t('uploading') : t('upload')}
            </button>
            <button
                type="button"
                disabled={isPending || selectedFiles.length === 0}
                onClick={() => setSelectedFiles([])}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 hover:dark:bg-slate-900 disabled:opacity-40"
            >
                {t('clear')}
            </button>
        </div>
    );
}