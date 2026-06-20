'use client';
import { useEffect, useState } from "react";
import ChatHistory from "./components/ChatHistory";
import WelcomeScreen from "./components/WelcomeScreen";
import { useRouter } from "next/navigation";
import { getChatRooms, createNewChatRoom } from "./action";

interface ChatRoom {
    id: string;
    title: string | null;
    user_id: string;
    created_at: string;
}

export default function AssistantPage() {
    const router = useRouter();
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    const handleNewChat = async (message: string) => {
        const stream = await createNewChatRoom(message);
        if (!stream) return;

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let navigated = false;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n\n").filter(Boolean);

            for (const line of lines) {
                const data = line.replace("data: ", "");
                if (data === "[DONE]") break;

                const parsed = JSON.parse(data);

                // first chunk has chatRoomId — navigate immediately
                if (parsed.chatRoomId && !navigated) {
                    navigated = true;
                    router.push(`/assistant/${parsed.chatRoomId}`);
                    return; // let the chat page handle the rest via polling/fetch
                }
            }
        }
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