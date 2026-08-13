'use client';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { setLocale } from '@/lib/locale';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const [isPending, startTransition] = useTransition();

    const toggle = () => {
        const next = locale === 'en' ? 'fi' : 'en';
        startTransition(() => setLocale(next));
    };

    return (
        <div className="flex rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            {['en', 'fi'].map((lang) => (
                <button
                    key={lang}
                    onClick={() => startTransition(() => setLocale(lang))}
                    disabled={isPending || locale === lang}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                        locale === lang
                            ? 'bg-slate-950 dark:bg-slate-800 text-white'
                            : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-50 hover:dark:bg-slate-900'
                    }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
}