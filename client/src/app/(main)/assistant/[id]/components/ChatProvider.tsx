'use client';

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import ChatHistory from "../../components/ChatHistory";
import Messages from "../../components/Messages";
import Input from "../../components/Input";
import { useChat } from "@/hooks/useChat";

interface Props {
    header: ReactNode;
}

export default function ChatProvider({ header }: Props) {
    const params = useParams();
    const id = params.id as string;
    const { messages, setMessages, chatRooms, input, setInput, handleSend, onDelete } = useChat(id);

    return (
        <div className="flex h-dvh bg-slate-50">
            <ChatHistory onDelete={onDelete} chatRooms={chatRooms} activeChatId={id as string} />
            <div className="flex flex-1 flex-col">
                {header}
                <Messages messages={messages} />
                <Input input={input} setInput={setInput} handleSend={handleSend}/>
            </div>
        </div>
    );
};