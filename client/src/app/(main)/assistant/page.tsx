'use client';
import { useEffect, useState } from "react";
import ChatHistory from "./components/ChatHistory";
import WelcomeScreen from "./components/WelcomeScreen";
import { useRouter } from "next/navigation";
import { getChatRooms, createNewChatRoom } from "./action";
import { deleteChatRoom } from "./action";

interface ChatRoom {
    id: string;
    title: string | null;
    user_id: string;
    created_at: string;
}

export default function AssistantPage() {
    const router = useRouter();
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [input, setInput] = useState("");

    const handleNewChat = async (message: string) => {
        setInput("");
        const data = await createNewChatRoom(message);
        if (!data) return;
        router.push(`/assistant/${data.chatRoomId}?firstMessage=${encodeURIComponent(message)}`);
    };

    useEffect(() => {
        const fetchChatRooms = async () => {
            const data = await getChatRooms();
            setChatRooms(data.chatRooms);
        };
        fetchChatRooms();
    }, []);

    const onDelete = async (id: string) => {
        const data = await deleteChatRoom(id);
        if (!data) return;
        setChatRooms(prev => prev.filter(room => room.id !== id));
    };

    return (
        <div className="flex h-dvh bg-slate-50">
            <ChatHistory onDelete={onDelete} chatRooms={chatRooms} activeChatId={null} />
            <div className="flex flex-1 flex-col">
                <WelcomeScreen input={input} setInput={setInput} onSend={handleNewChat} />
            </div>
        </div>
    );
}