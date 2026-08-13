'use client';

import { useTranslations } from 'next-intl';

interface Props {
    setInput: React.Dispatch<React.SetStateAction<string>>;
    input: string;
    handleSend: (message: string) => void;
}

export default function Input({ handleSend, setInput, input }: Props) {
    const t = useTranslations('chatInput');

    return (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <div className="flex items-end gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                    <textarea
                        data-testid="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={1}
                        placeholder={t('placeholder')}
                        className="flex-1 resize-none bg-transparent text-sm text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(input);
                            }
                        }}
                    />
                    <button data-testid="send-message-button" onClick={() => handleSend(input)} className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-teal-600 text-white transition-colors hover:bg-teal-700">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
                    {t('disclaimer')}
                </p>
            </div>
        </div>
    );
}