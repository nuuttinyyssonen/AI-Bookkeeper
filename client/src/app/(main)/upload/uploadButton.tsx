'use client';
import { useEffect, useRef, useState } from "react";
import { getBatchStatus, UploadFiles, type UploadState } from "./action";
import { toast } from "sonner";

const initialState: UploadState = {};

export default function UploadButton() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedIncomeFiles, setSelectedIncomeFiles] = useState<File[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [progress, setProgress] = useState<string | null>(null);

    const pollBatchStatus = (batchId?: string) => {
        return new Promise<{ pending_documents: number; completed_documents: number; total: number; processing_documents: number }>((resolve, reject) => {
            const interval = setInterval(async () => {
                try {
                    if (!batchId) return;
                    const data = await getBatchStatus(batchId);
                    setProgress(`${data.completed_documents}/${data.total} analyzed`);
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
        const result = await UploadFiles(initialState, formData, isIncome);
        if (result.success) {
            toast.success("Files uploaded successfully");
            clearFiles();
            setProgress("Analyzing receipts...");
            try {
                const data = await pollBatchStatus(result.upload_batch_id);
                setProgress(null);
                toast.success(`${data.completed_documents}/${data.total} receipt(s) analyzed`);
            } catch {
                setProgress(null);
                toast.error("Receipt analysis failed");
            }
        }
        if (result.error) toast.error(result.error);
        setIsPending(false);
    };

    return (
        <div className="grid gap-6">
            {progress && (
                <div className="flex items-center gap-3 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
                    <p className="text-sm font-medium text-teal-700">{progress}</p>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                {/* Expense Upload */}
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100">
                            <svg className="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Expense receipts</p>
                            <p className="text-xs text-slate-500">Purchases and costs</p>
                        </div>
                    </div>

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Select files
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

                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={isPending || selectedFiles.length === 0}
                            onClick={() => runUpload(selectedFiles, false, () => setSelectedFiles([]))}
                            className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-40"
                        >
                            {isPending ? "Uploading..." : "Upload"}
                        </button>
                        <button
                            type="button"
                            disabled={isPending || selectedFiles.length === 0}
                            onClick={() => setSelectedFiles([])}
                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Income Upload */}
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                            <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Income receipts</p>
                            <p className="text-xs text-slate-500">Sales and revenue</p>
                        </div>
                    </div>

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Select files
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp,application/pdf"
                            className="hidden"
                            onChange={handleIncomeChange}
                        />
                    </label>

                    {selectedIncomeFiles.length > 0 && (
                        <ul className="space-y-1 rounded-lg border border-slate-100 bg-slate-50 p-2">
                            {selectedIncomeFiles.map(file => (
                                <li key={`${file.name}-${file.size}`} className="flex items-center gap-2 truncate text-xs text-slate-600">
                                    <span className="text-slate-400">📎</span>
                                    {file.name}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={isPending || selectedIncomeFiles.length === 0}
                            onClick={() => runUpload(selectedIncomeFiles, true, () => setSelectedIncomeFiles([]))}
                            className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-40"
                        >
                            {isPending ? "Uploading..." : "Upload"}
                        </button>
                        <button
                            type="button"
                            disabled={isPending || selectedIncomeFiles.length === 0}
                            onClick={() => setSelectedIncomeFiles([])}
                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}