'use client';
import { useEffect, useRef, useState } from "react";
import { getBatchStatus, UploadFiles, type UploadState } from "./action";
import { toast } from "sonner";

const initialState: UploadState = {};

export default function UploadButton() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [progress, setProgress] = useState<string | null>(null);

    const pollBatchStatus = (batchId?: string) => {
        return new Promise<{ pending_documents: number; completed_documents: number; total: number }>((resolve, reject) => {
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
                const newFiles = files.filter(f => !existingNames.has(f.name));
                return [...prev, ...newFiles];
            });
        }
        e.target.value = "";
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setIsPending(true);
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append("files", file));

        const result = await UploadFiles(initialState, formData);

        if (result.success) {
            toast.success("Files uploaded successfully");
            setSelectedFiles([]);
            setProgress("Analyzing receipts...");

            try {
                const data = await pollBatchStatus(result.upload_batch_id);
                setProgress(null);
                toast.success(`${data.completed_documents}/${data.total} receipt(s) analyzed successfully`);
            } catch (error) {
                setProgress(null);
                toast.error("Receipt analysis failed");
            }
        }

        if (result.error) {
            toast.error(result.error);
        }
        setIsPending(false);
    };

    return (
        <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 rounded-md bg-teal-600 p-4 text-sm font-semibold text-white">
                    <span>Select documents</span>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        className="w-full text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-teal-700"
                        onChange={handleChange}
                    />
                </label>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-4">
                {progress && (
                    <p className="mb-3 text-sm font-medium text-teal-600">{progress}</p>
                )}
                {selectedFiles.length > 0 ? (
                    <ul className="mb-3 space-y-1">
                        {selectedFiles.map(file => (
                            <li key={`${file.name}-${file.size}`} className="truncate text-sm text-slate-700">
                                📎 {file.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mb-3 text-sm text-slate-500">No files selected.</p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        disabled={isPending || selectedFiles.length === 0}
                        onClick={handleUpload}
                        className="h-14 w-full rounded-md bg-teal-600 px-6 text-base font-semibold text-white hover:bg-teal-700 disabled:opacity-60 sm:h-12 sm:w-auto sm:text-sm"
                    >
                        {isPending ? "Uploading..." : "Upload files"}
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => setSelectedFiles([])}
                        className="h-14 w-full rounded-md bg-slate-950 px-6 text-base font-semibold text-white hover:bg-slate-800 disabled:opacity-60 sm:h-12 sm:w-auto sm:text-sm"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}