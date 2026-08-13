'use client';

import { useTranslations } from 'next-intl';
import Input from "./Input";

interface Props {
    onSend: (message: string) => void;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    input: string;
    userName: string;
}

export default function WelcomeScreen({ onSend, input, setInput, userName }: Props) {
    const t = useTranslations('welcomeScreen');
    const suggestions = t.raw('suggestions') as string[];

    return (
        <div className="flex flex-1 flex-col items-center justify-center px-4">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{t('greeting', { name: userName })}</h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">{t('subtitle')}</p>
            </div>

            <div className="mb-6 flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => onSend(suggestion)}
                        className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 shadow-sm transition hover:border-teal-400 hover:text-teal-600 hover:dark:text-teal-300"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            <div className="w-full">
                <Input handleSend={onSend} input={input} setInput={setInput} />
            </div>
        </div>
    );
}