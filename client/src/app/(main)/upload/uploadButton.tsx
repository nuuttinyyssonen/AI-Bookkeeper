"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadFiles } from "./action";

export default function UploadButton() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleUpload = async () => {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });
        
        const result = await UploadFiles(formData);
        
        if (result?.error) {
            setError(result.error);
        } else if (result?.success) {
            setSuccess("Files uploaded successfully!");
            setSelectedFiles([]);
        }
    };

    return (
        <div className="grid gap-3">
            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-teal-600">{success}</p>}
            <input
                ref={inputRef}
                type="file"
                name="files"
                multiple
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(event) => {
                    const newFiles = Array.from(event.target.files ?? []);
                    if (newFiles.length > 0) {
                        setSelectedFiles((currentFiles) => [
                            ...currentFiles,
                            ...newFiles
                        ]);
                    }
                    event.target.value = "";
                }}
            />

            <Button
                type="button"
                className="w-full rounded-md bg-teal-600 hover:bg-teal-700 sm:w-auto"
                onClick={() => inputRef.current?.click()}
            >
                Select documents
            </Button>

            {selectedFiles.length > 0 && (
                <div className="rounded-md border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-800">
                        Selected files ({selectedFiles.length})
                    </p>
                    <ul className="mt-2 divide-y divide-slate-100 rounded-md border border-slate-200">
                        {selectedFiles.map((file, index) => (
                            <li
                                key={`${file.name}-${file.lastModified}-${index}`}
                                className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                            >
                                <span className="min-w-0 truncate text-slate-700">
                                    {index + 1}. {file.name}
                                </span>
                                <span className="shrink-0 text-xs text-slate-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <Button
                            type="button"
                            className="w-full rounded-md bg-teal-600 hover:bg-teal-700 sm:w-auto"
                            onClick={handleUpload}
                        >
                            Upload files
                        </Button>
                        <Button
                            type="button"
                            className="w-full rounded-md bg-red-600 hover:bg-red-700 sm:w-auto"
                            onClick={() => setSelectedFiles([])}
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
