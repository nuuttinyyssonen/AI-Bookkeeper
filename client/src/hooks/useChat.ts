import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getChatRooms, getChatMessages } from "../app/(main)/assistant/action";
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
    const t = useTranslations('demo');
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [input, setInput] = useState("");
    const initialized = useRef(false);
    const searchParams = useSearchParams();

    const handleSend = async (_message: string) => {
        setInput("");
        toast.error(t('assistantBlocked'));
    };

    const onDelete = async (_id: string) => {
        toast.error(t('chatDeleteBlocked'));
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