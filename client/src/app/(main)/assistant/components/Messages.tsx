'use client';

interface Message {
    id: number,
    role: string,
    content: string
};

interface Props {
    messages: Message[]
};

import { useRef, useEffect } from "react";

export default function Messages({messages}: Props) {
    const lastMessage = messages[messages.length - 1];
    const isWaiting = lastMessage?.role === "USER";
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
                            <div data-testid="chat-message" data-role={msg.role} className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                isUser
                                    ? "rounded-br-sm bg-slate-900 dark:bg-slate-800 text-white"
                                    : "rounded-bl-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 shadow-sm"
                            }`}>
                                {msg.content}
                            </div>
                            {isUser && (
                                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-900 dark:bg-slate-800 text-xs font-semibold text-white">
                                    N
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Typing indicator */}
                {isWaiting && (
                <div className="flex items-end gap-2">
                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
                        AI
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 shadow-sm">
                        <span className="typing-dot h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" style={{ animationDelay: "0ms" }} />
                        <span className="typing-dot h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" style={{ animationDelay: "0.2s" }} />
                        <span className="typing-dot h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" style={{ animationDelay: "0.4s" }} />
                    </div>
                </div>
                )}
            </div>
            <div ref={bottomRef} />
        </div>
    );
};