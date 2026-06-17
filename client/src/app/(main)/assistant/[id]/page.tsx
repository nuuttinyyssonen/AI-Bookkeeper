'use client';
import ChatHistory from "../components/ChatHistory";
import Header from "../components/Header";
import Messages from "../components/Messages";
import Input from "../components/Input";
import { useState } from "react";
import { useParams } from "next/navigation";

interface Message {
    id: number;
    role: "USER" | "ASSISTANT";
    content: string;
}

const chatRooms = [
    { id: "1", title: "ALV-kysymykset", lastMessage: "Ohjelmistolisenssin ostoon...", date: "Tänään" },
    { id: "2", title: "Matkakulut", lastMessage: "Voinko vähentää...", date: "Eilen" },
    { id: "3", title: "Tilinpäätös 2026", lastMessage: "Milloin tase...", date: "Ma" },
];

const messages_proc: Message[] = [
    { id: 1, role: "USER", content: "Mitä ALV-prosenttia käytän ohjelmistolisenssin ostoon?" },
    { id: 2, role: "ASSISTANT", content: "Ohjelmistolisenssin ostoon sovelletaan yleistä ALV-kantaa, joka Suomessa on 25,5 %. Tämä koskee myös digitaalisia palveluja ja SaaS-tilauksia. Muista, että voit vähentää ALV:n ostoista, jos olet ALV-velvollinen yritys." },
    { id: 3, role: "USER", content: "Entä jos ostan fyysisen tuotteen toimistoon?" },
    { id: 4, role: "ASSISTANT", content: "Toimistotarvikkeet kuten paperit, kynät ja muut toimistotarvikkeet kuuluvat myös 25,5 % ALV-kantaan. Nämä ovat täysin vähennyskelpoisia kuluja, kun ne on hankittu yritystoimintaa varten." },
];

export default function ChatPage() {
    const { id } = useParams();
    const [messages, setMessages] = useState<Message[]>(messages_proc);

    return (
        <div className="flex h-dvh bg-slate-50">
            <ChatHistory chatRooms={chatRooms} activeChatId={id as string} />
            <div className="flex flex-1 flex-col">
                <Header />
                <Messages messages={messages} />
                <Input messages={messages} setMessages={setMessages} />
            </div>
        </div>
    );
}