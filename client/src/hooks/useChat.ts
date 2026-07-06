import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getChatRooms, getChatMessages, streamChatMessage, deleteChatRoom } from "../app/(main)/assistant/action";
import { toast } from "sonner";

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

export const useChat = (id: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [input, setInput] = useState("");
    const initialized = useRef(false);
    const searchParams = useSearchParams();

    const handleSend = async (message: string) => {
        setInput("");
        setMessages(prev => [...prev, { id: Date.now(), role: "USER", content: message }]);

        const stream = await streamChatMessage(id, message);
        if (!stream || 'error' in stream) return;

        const reader = (stream as ReadableStream).getReader();
        const decoder = new TextDecoder();
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
        if (data.error) {
            toast.error(data.error);
            return
        }
        setChatRooms(prev => prev.filter(room => room.id !== id));
    };

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const init = async () => {
            if (!id) return;

            const [chatRoomsData, messagesData] = await Promise.all([
                getChatRooms(),
                getChatMessages(id)
            ]);

            setChatRooms(chatRoomsData?.chatRooms ?? []);
            setMessages(messagesData?.messages ?? []);

            const firstMessage = searchParams.get("firstMessage");
            if (firstMessage && messagesData.messages.length === 0) {
                handleSend(firstMessage);
            }
        };

        init();
    }, [id]);

    return { messages, setMessages, chatRooms, setChatRooms, input, setInput, handleSend, onDelete };
};