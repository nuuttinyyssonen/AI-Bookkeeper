"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function DemoButton() {
    const tDemo = useTranslations('demo');

    const demoButton = () => {
        toast.error(tDemo('uploadBlocked'));
    }


    return (
        <button onClick={demoButton} data-testid="upload-link" className="h-10 w-full rounded-md bg-teal-600 px-3 text-sm font-semibold text-white hover:bg-teal-700 sm:w-auto sm:px-4 flex items-center justify-center">
            Lisää kuitti
        </button>
    )
}