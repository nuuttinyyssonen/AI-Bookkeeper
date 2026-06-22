interface Props {
    setInput: React.Dispatch<React.SetStateAction<string>>;
    input: string;
    handleSend: (message: string) => void;
};


export default function Input({handleSend, setInput, input}: Props) {
    return (
        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={1}
                        placeholder="Ask about VAT, expenses, reports..."
                        className="flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(input);
                            }
                        }}
                    />
                    <button onClick={() => handleSend(input)} className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-teal-600 text-white transition-colors hover:bg-teal-700">
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
};