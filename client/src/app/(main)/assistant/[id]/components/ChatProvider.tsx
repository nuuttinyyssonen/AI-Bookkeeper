'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import ChatHistory from "../../components/ChatHistory";
import Header from "../../components/Header";
import Messages from "../../components/Messages";
import Input from "../../components/Input";
import { useChat } from "@/hooks/useChat";

export default function ChatProvider() {
    const params = useParams();
    const id = params.id as string;
    const { messages, setMessages, chatRooms, input, setInput, handleSend, onDelete } = useChat(id);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <div className="relative flex h-dvh overflow-hidden bg-slate-50">
            <ChatHistory
                onDelete={onDelete}
                chatRooms={chatRooms}
                activeChatId={id as string}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
            <div
                className={`flex h-full w-full flex-1 flex-col transition-transform duration-300 ease-in-out sm:translate-x-0 ${
                    isHistoryOpen ? "translate-x-full" : "translate-x-0"
                }`}
            >
                <Header onToggleHistory={() => setIsHistoryOpen(true)} />
                <Messages messages={messages} />
                <Input input={input} setInput={setInput} handleSend={handleSend}/>
            </div>
        </div>
    );
};