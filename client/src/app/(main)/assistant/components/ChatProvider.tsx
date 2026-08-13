'use client';

import ChatHistory from "./ChatHistory";
import WelcomeScreen from "./WelcomeScreen";
import { useAssistant } from "@/hooks/useAssistant";

interface Props {
    userName: string
}

export default function ChatProvider({ userName }: Props) {
    const { chatRooms, input, setInput, handleNewChat, onDelete } = useAssistant();
    
    return (
        <div className="flex h-dvh bg-slate-50 dark:bg-slate-900">
            <ChatHistory onDelete={onDelete} chatRooms={chatRooms} activeChatId={null} />
            <div className="flex flex-1 flex-col">
                <WelcomeScreen userName={userName} input={input} setInput={setInput} onSend={handleNewChat} />
            </div>
        </div>
    );
};