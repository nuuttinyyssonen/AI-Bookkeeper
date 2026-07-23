'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { getBatchStatus, UploadFiles, type UploadState } from "../action";
import { toast } from "sonner";

import Progressbar from "./Progressbar";
import ExpenseUpload from "./ExpenseUpload";
import IncomeUpload from "./IncomeUpload";

const initialState: UploadState = {};

export default function UploadOverview() {
    const t = useTranslations('uploadOverview');

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedIncomeFiles, setSelectedIncomeFiles] = useState<File[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [progress, setProgress] = useState<string | null>(null);

    const pollBatchStatus = (batchId?: string) => {
        return new Promise<{ pending_documents: number; completed_documents: number; total: number; processing_documents: number; failed_documents: number }>((resolve, reject) => {
            const interval = setInterval(async () => {
                try {
                    if (!batchId) return;
                    const data = await getBatchStatus(batchId);
                    setProgress(t('analyzedProgress', { completed: data.completed_documents, total: data.total }));
                    if (data.pending_documents === 0 && data.processing_documents === 0) {
                        clearInterval(interval);
                        resolve(data);
                    }
                } catch (error) {
                    clearInterval(interval);
                    reject(error);
                }
            }, 3000);
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 0) {
            setSelectedFiles(prev => {
                const existingNames = new Set(prev.map(f => f.name));
                return [...prev, ...files.filter(f => !existingNames.has(f.name))];
            });
        }
        e.target.value = "";
    };

    const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 0) {
            setSelectedIncomeFiles(prev => {
                const existingNames = new Set(prev.map(f => f.name));
                return [...prev, ...files.filter(f => !existingNames.has(f.name))];
            });
        }
        e.target.value = "";
    };

    const runUpload = async (files: File[], isIncome: boolean, clearFiles: () => void) => {
        if (files.length === 0) return;
        setIsPending(true);
        const formData = new FormData();
        files.forEach(file => formData.append("files", file));

        try {
            const result = await UploadFiles(initialState, formData, isIncome);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            if (result.success) {
                toast.success(t('uploadSuccess'));
                clearFiles();
                setProgress(t('analyzing'));
                try {
                    const data = await pollBatchStatus(result.upload_batch_id);
                    setProgress(null);
                    toast.success(t('analyzeSuccess', { completed: data.completed_documents, total: data.total }));
                    if (data.failed_documents > 0) {
                        toast.error(`${data.failed_documents} kuittia epäonnistui analysoinnissa`);
                    }
                } catch {
                    setProgress(null);
                    toast.error(t('analyzeFailed'));
                }
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="grid gap-6">
            {progress && <Progressbar progress={progress} />}
            <div className="grid gap-4 sm:grid-cols-2">
                <ExpenseUpload
                    handleChange={handleChange}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    isPending={isPending}
                    runUpload={runUpload}
                />
                <IncomeUpload
                    handleIncomeChange={handleIncomeChange}
                    selectedIncomeFiles={selectedIncomeFiles}
                    setSelectedIncomeFiles={setSelectedIncomeFiles}
                    isPending={isPending}
                    runUpload={runUpload}
                />
            </div>
        </div>
    );
}