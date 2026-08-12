'use client';

import { useTranslations } from 'next-intl';

interface Props {
    onToggleHistory: () => void;
}

export default function Header({ onToggleHistory }: Props) {
    const t = useTranslations('assistantHeader');

    return (
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-slate-900">{t('title')}</h1>
                        <p className="text-xs text-slate-500">{t('subtitle')}</p>
                    </div>
                </div>
                <button onClick={onToggleHistory} className="sm:hidden rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">
                    {t('chats')}
                </button>
            </div>
        </header>
    );
}