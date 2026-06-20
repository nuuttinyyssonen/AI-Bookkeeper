'use client';
import ChatHistory from "../components/ChatHistory";
import Header from "../components/Header";
import Messages from "../components/Messages";
import Input from "../components/Input";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getChatRooms, getChatMessages, streamChatMessage, deleteChatRoom } from "../action";

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
    const [input, setInput] = useState("");

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
        fetchMessages();
    }, [id]);

    const handleSend = async (message: string) => {
        // optimistically add user message
        setInput("");
        setMessages(prev => [...prev, { id: Date.now(), role: "USER", content: message }]);

        const stream = await streamChatMessage(id, message);
        if (!stream) return;
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        // add empty assistant message to fill in
        const assistantId = Date.now() + 1;
        setMessages(prev => [...prev, { id: assistantId, role: "ASSISTANT", content: "" }]);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n\n").filter(Boolean);

            for (const line of lines) {
                const data = line.replace("data: ", "");
                if (data === "[DONE]") break;

                const { text } = JSON.parse(data);
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantId
                        ? { ...msg, content: msg.content + text }
                        : msg
                ));
            }
        }
    };

    const onDelete = async (id: string) => {
        const data = await deleteChatRoom(id);
        if (!data) return;
        setChatRooms(prev => prev.filter(room => room.id !== id));
    };

    return (
        <div className="flex h-dvh bg-slate-50">
            <ChatHistory onDelete={onDelete} chatRooms={chatRooms} activeChatId={id as string} />
            <div className="flex flex-1 flex-col">
                <Header />
                <Messages messages={messages} />
                <Input input={input} setInput={setInput} handleSend={handleSend} id={id} messages={messages} setMessages={setMessages} />
            </div>
        </div>
    );
}