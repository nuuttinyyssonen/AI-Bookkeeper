interface Props {
    isPending: boolean,
    isIncome: boolean,
    selectedFiles: File[],
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>,
    runUpload: (files: File[], isIncome: boolean, clearFiles: () => void) => Promise<void>;
};

export default function UploadButtons({isPending, selectedFiles, setSelectedFiles, runUpload, isIncome}: Props) {
    return (
        <div className="flex gap-2">
            <button
                type="button"
                disabled={isPending || selectedFiles.length === 0}
                onClick={() => runUpload(selectedFiles, isIncome, () => setSelectedFiles([]))}
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
    );
};