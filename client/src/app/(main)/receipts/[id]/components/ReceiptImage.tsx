"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Props {
    loadingFile: boolean;
    fileError: string | null;
    fileUrl: string | null;
    fileType: string | null;
    fileName: string | null;
}

export default function ReceiptImage({ loadingFile, fileError, fileUrl, fileType, fileName }: Props) {
    const t = useTranslations('receiptImage');

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent>
                {loadingFile ? (
                    <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 dark:text-slate-400">{t('loading')}</div>
                ) : fileError ? (
                    <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 dark:text-slate-400">{fileError}</div>
                ) : fileUrl ? (
                    <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                        {fileType?.includes("pdf") ? (
                            <iframe src={fileUrl} title={fileName ?? "Receipt PDF"} className="h-96 w-full" />
                        ) : (
                            <img src={fileUrl} alt={`Receipt file ${fileName ?? "preview"}`} className="h-full w-full object-contain" />
                        )}
                    </div>
                ) : (
                    <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 dark:text-slate-400">{t('noPreview')}</div>
                )}
            </CardContent>
        </Card>
    );
}