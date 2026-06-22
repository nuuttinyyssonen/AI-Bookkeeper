'use client';

import ChatHistory from "./ChatHistory";
import WelcomeScreen from "./WelcomeScreen";
import { useAssistant } from "@/hooks/useAssistant";

export default function ChatProvider() {
    const { chatRooms, input, setInput, handleNewChat, onDelete } = useAssistant();
    
    return (
        <div className="flex h-dvh bg-slate-50">
            <ChatHistory onDelete={onDelete} chatRooms={chatRooms} activeChatId={null} />
            <div className="flex flex-1 flex-col">
                <WelcomeScreen input={input} setInput={setInput} onSend={handleNewChat} />
            </div>
        </div>
    );
};