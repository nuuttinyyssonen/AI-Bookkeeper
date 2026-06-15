import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Props {
    loadingFile: boolean;
    fileError: string | null;
    fileUrl: string | null;
    fileType: string | null;
    fileName: string | null;
}

export default function ReceiptImage({loadingFile, fileError, fileUrl, fileType, fileName}: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Receipt image</CardTitle>
                <CardDescription>Preview the uploaded receipt for this entry.</CardDescription>
            </CardHeader>
            <CardContent>
                {loadingFile ? (
                <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-sm text-slate-500">Loading receipt preview...</div>
                ) : fileError ? (
                <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-sm text-slate-500">{fileError}</div>
                ) : fileUrl ? (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                    {fileType?.includes("pdf") ? (
                    <iframe src={fileUrl} title={fileName ?? "Receipt PDF"} className="h-96 w-full" />
                    ) : (
                    <img src={fileUrl} alt={`Receipt file ${fileName ?? "preview"}`} className="h-full w-full object-contain" />
                    )}
                </div>
                ) : (
                <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-sm text-slate-500">No preview available.</div>
                )}
            </CardContent>
        </Card>
    );
};