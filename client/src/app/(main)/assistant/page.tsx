'use client';
import ChatHistory from "./components/ChatHistory";
import WelcomeScreen from "./components/WelcomeScreen";
import { useRouter } from "next/navigation";

const chatRooms = [
    { id: "1", title: "ALV-kysymykset", lastMessage: "Ohjelmistolisenssin ostoon...", date: "Tänään" },
    { id: "2", title: "Matkakulut", lastMessage: "Voinko vähentää...", date: "Eilen" },
    { id: "3", title: "Tilinpäätös 2026", lastMessage: "Milloin tase...", date: "Ma" },
];

export default function AssistantPage() {
    const router = useRouter();

    const handleNewChat = (message: string) => {
        const newId = Date.now().toString();
        router.push(`/assistant/${newId}`);
    };

    return (
        <div className="flex h-dvh bg-slate-50">
            <ChatHistory chatRooms={chatRooms} activeChatId={null} />
            <div className="flex flex-1 flex-col">
                <WelcomeScreen onSend={handleNewChat} />
            </div>
        </div>
    );
}