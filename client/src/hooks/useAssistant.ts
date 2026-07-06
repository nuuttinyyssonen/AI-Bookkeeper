import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getChatRooms, createNewChatRoom, deleteChatRoom } from "../app/(main)/assistant/action";
import { toast } from "sonner";

interface ChatRoom {
    id: string;
    title: string | null;
    user_id: string;
    created_at: string;
}

export const useAssistant = () => {
    const router = useRouter();
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [input, setInput] = useState("");

    const handleNewChat = async (message: string) => {
        setInput("");
        const data = await createNewChatRoom(message);
        if (data.error) {
            toast.error(data.error);
            return
        }
        router.push(`/assistant/${data.chatRoomId}?firstMessage=${encodeURIComponent(message)}`);
    };

    const onDelete = async (id: string) => {
        const data = await deleteChatRoom(id);
        if(data.error) {
            toast.error(data.error)
            return;
        }
        setChatRooms(prev => prev.filter(room => room.id !== id));
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