import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getChatRooms } from "../app/(main)/assistant/action";
import { toast } from "sonner";

interface ChatRoom {
    id: string;
    title: string | null;
    user_id: string;
    created_at: string;
}

export const useAssistant = () => {
    const t = useTranslations('demo');
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [input, setInput] = useState("");

    const handleNewChat = async (_message: string) => {
        toast.error(t('assistantBlocked'));
    };

    const onDelete = async (_id: string) => {
        toast.error(t('chatDeleteBlocked'));
    };

    useEffect(() => {
        const fetchChatRooms = async () => {
            const data = await getChatRooms();
            if(data.error) {
                toast.error(data.error)
                return;
            }
            setChatRooms(data?.chatRooms ?? []);
        };
        fetchChatRooms();
    }, []);

    return { chatRooms, setChatRooms, input, setInput, handleNewChat, onDelete };
};