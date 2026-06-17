interface Message {
    id: number,
    role: string,
    content: string
};

interface Props {
    messages: Message[]
};

export default function Messages({messages}: Props) {
    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-3xl space-y-6">

                {messages.map((msg) => {
                    const isUser = msg.role === "USER";
                    return (
                        <div key={msg.id} className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                            {!isUser && (
                                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
                                    AI
                                </div>
                            )}
                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                isUser
                                    ? "rounded-br-sm bg-slate-900 text-white"
                                    : "rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
                            }`}>
                                {msg.content}
                            </div>
                            {isUser && (
                                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                    N
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Typing indicator */}
                <div className="flex items-end gap-2">
                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
                        AI
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
                    </div>
                </div>
            </div>
        </div>
    );
};