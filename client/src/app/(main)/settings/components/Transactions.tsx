'use client';

import { useTranslations } from "next-intl";
import { PaymentHistoryItem } from "@/app/types/subscription";

interface Props {
    history: PaymentHistoryItem[];
}

export default function Transactions({ history }: Props) {
    const t = useTranslations('paymentHistory');

    return (
        <div className="rounded-lg border border-border bg-white dark:bg-slate-950 p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-950 dark:text-slate-50">{t('title')}</h2>
            <div className="divide-y divide-border">
                {history.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-medium text-slate-950 dark:text-slate-50">{payment.description}</p>
                            <p className="text-xs text-muted-foreground">{payment.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900 text-teal-800 dark:text-teal-100 border border-teal-200">
                                {payment.status}
                            </span>
                            <p className="text-sm font-medium text-slate-950 dark:text-slate-50">{payment.amount}</p>
                            {payment.pdf && (<a
  
                                href={payment.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-7 px-2.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:dark:bg-slate-900 transition-colors flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {t('pdf')}
                            </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}