'use client';
import ChatHistory from "../components/ChatHistory";
import Header from "../components/Header";
import Messages from "../components/Messages";
import Input from "../components/Input";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getChatRooms, getChatMessages } from "../action";

interface Message {
    id: number;
    role: "USER" | "ASSISTANT";
    content: string;
}

interface ChatRoom {
    id: string;
    title: string | null;
    user_id: string;
    created_at: string;
}

export default function ChatPage() {
    const params = useParams();
    const id = params.id as string;
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    useEffect(() => {
        const fetchChatRooms = async () => {
            const data = await getChatRooms();
            setChatRooms(data.chatRooms);
        };
        fetchChatRooms();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!id) return;
            const data = await getChatMessages(id);
            setMessages(data.messages);
        };

        fetchMessages(); // initial fetch

        const interval = setInterval(fetchMessages, 3000); // poll every 3s

        return () => clearInterval(interval); // cleanup on unmount
    }, [id]);

    return (
        <div className="flex h-dvh bg-slate-50">
            <ChatHistory chatRooms={chatRooms} activeChatId={id as string} />
            <div className="flex flex-1 flex-col">
                <Header />
                <Messages messages={messages} />
                <Input id={id} messages={messages} setMessages={setMessages} />
            </div>
        </div>
    );
}