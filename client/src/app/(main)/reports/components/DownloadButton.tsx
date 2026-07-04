'use client';

import { useTranslations } from "next-intl";

interface DownloadButtonProps {
    id: string
}

export default function DownloadButton({id}: DownloadButtonProps) {
    const t = useTranslations('reportDownloadButton');

    const handleDownload = async (id: string) => {
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
            <button onClick={() => handleDownload(id)} className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700">
                {t('download')}
            </button>
        </div>
    )
}