'use client';

import { useState } from "react";
import { useTranslations } from 'next-intl';
import ChatHistory from "./ChatHistory";
import WelcomeScreen from "./WelcomeScreen";
import { useAssistant } from "@/hooks/useAssistant";

interface Props {
    userName: string
}

export default function ChatProvider({ userName }: Props) {
    const t = useTranslations('assistantHeader');
    const { chatRooms, input, setInput, handleNewChat, onDelete } = useAssistant();
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <div className="relative flex h-dvh overflow-hidden bg-slate-50">
            <ChatHistory
                onDelete={onDelete}
                chatRooms={chatRooms}
                activeChatId={null}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
            <div
                className={`flex h-full w-full flex-1 flex-col transition-transform duration-300 ease-in-out sm:translate-x-0 ${
                    isHistoryOpen ? "translate-x-full" : "translate-x-0"
                }`}
            >
                <div className="flex items-center justify-end border-b border-slate-200 bg-white px-4 py-3 sm:hidden">
                    <button
                        onClick={() => setIsHistoryOpen(true)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                        {t('chats')}
                    </button>
                </div>
                <WelcomeScreen userName={userName} input={input} setInput={setInput} onSend={handleNewChat} />
            </div>
        </div>
    );
};