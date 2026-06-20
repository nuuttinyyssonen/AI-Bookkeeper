'use client';
import { useState } from "react";

interface Props {
    onSend: (message: string) => void;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    input: string;
};

export default function WelcomeScreen({ onSend, input, setInput }: Props) {

    const handleSubmit = () => {
        if (!input.trim()) return;
        onSend(input);
    };

    return (
        <div className="flex flex-1 flex-col items-center justify-center px-4">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-semibold text-slate-900">Hei, Nuutti 👋</h1>
                <p className="mt-2 text-slate-500">Kysy mitä tahansa kirjanpidosta, ALV:stä tai taloudesta.</p>
            </div>

            {/* Suggestion chips */}
            <div className="mb-6 flex flex-wrap justify-center gap-2">
                {["Mikä on ALV-kanta?", "Miten teen tilinpäätöksen?", "Voinko vähentää matkakulut?"].map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => onSend(suggestion)}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:border-teal-400 hover:text-teal-600"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="w-full max-w-2xl">
                <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                    <textarea
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder="Kysy kirjanpidosta..."
                        className="flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
                    />
                    <button
                        onClick={handleSubmit}
                        className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-teal-600 text-white transition hover:bg-teal-700"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <p className="mt-2 text-center text-xs text-slate-400">
                    AI can make mistakes. Always verify important financial decisions.
                </p>
            </div>
        </div>
    );
}