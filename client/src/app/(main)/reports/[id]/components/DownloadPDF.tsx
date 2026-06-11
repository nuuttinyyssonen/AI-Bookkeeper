'use client';

interface downloadPDFProps {
    id: string
}

export default function DownloadPDF({ id }: downloadPDFProps) {

    const handleDownload = async () => {
        const response = await fetch(`/api/report/${id}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vat-report-${id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <button onClick={handleDownload} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                Download PDF
            </button>
        </div>
    )
};