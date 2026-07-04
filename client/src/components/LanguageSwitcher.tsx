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
        <div className="flex rounded-md border border-slate-200 overflow-hidden">
            {['en', 'fi'].map((lang) => (
                <button
                    key={lang}
                    onClick={() => startTransition(() => setLocale(lang))}
                    disabled={isPending || locale === lang}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                        locale === lang
                            ? 'bg-slate-950 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
}