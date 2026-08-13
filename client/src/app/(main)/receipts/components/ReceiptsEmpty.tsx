"use client";

import { useTranslations } from "next-intl";
import { Receipt } from "@/lib/receipts";

interface Props {
    filtered: Receipt[];
}

export default function ReceiptsEmpty({ filtered }: Props) {
    const t = useTranslations('receiptsEmpty');

    return (
        <div>
            {filtered.length === 0 && (
                <div className="mt-8 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-8 text-center">
                    <h3 className="text-lg font-semibold">{t('title')}</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('description')}</p>
                </div>
            )}
        </div>
    );
}