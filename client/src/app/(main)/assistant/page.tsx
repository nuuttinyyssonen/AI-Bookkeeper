'use client';
import { useEffect, useState } from "react";
import ChatHistory from "./components/ChatHistory";
import WelcomeScreen from "./components/WelcomeScreen";
import { useRouter } from "next/navigation";
import { getChatRooms } from "./action";

interface ChatRoom {
    id: string;
    title: string | null;
    user_id: string;
    created_at: string;
}

export default function AssistantPage() {
    const router = useRouter();
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    const handleNewChat = (message: string) => {
        const newId = Date.now().toString();
        router.push(`/assistant/${newId}`);
    };

    useEffect(() => {
        const fetchChatRooms = async () => {
            const data = await getChatRooms();
            setChatRooms(data.chatRooms);
        };
        fetchChatRooms();
    }, []);

    return (
        <div className="flex h-dvh bg-slate-50">
            <ChatHistory chatRooms={chatRooms} activeChatId={null} />
            <div className="flex flex-1 flex-col">
                <WelcomeScreen onSend={handleNewChat} />
            </div>
        </div>
    );
}