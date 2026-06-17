'use client';

import ChatHistory from "./ChatHistory";
import Header from "./Header";
import Messages from "./Messages";
import Input from "./Input";

const chatRooms = [
    { id: "1", title: "ALV-kysymykset", lastMessage: "Ohjelmistolisenssin ostoon...", date: "Tänään" },
    { id: "2", title: "Matkakulut", lastMessage: "Voinko vähentää...", date: "Eilen" },
    { id: "3", title: "Tilinpäätös 2026", lastMessage: "Milloin tase...", date: "Ma" },
];

const messages = [
    { id: 1, role: "USER", content: "Mitä ALV-prosenttia käytän ohjelmistolisenssin ostoon?" },
    { id: 2, role: "ASSISTANT", content: "Ohjelmistolisenssin ostoon sovelletaan yleistä ALV-kantaa, joka Suomessa on 25,5 %. Tämä koskee myös digitaalisia palveluja ja SaaS-tilauksia. Muista, että voit vähentää ALV:n ostoista, jos olet ALV-velvollinen yritys." },
    { id: 3, role: "USER", content: "Entä jos ostan fyysisen tuotteen toimistoon?" },
    { id: 4, role: "ASSISTANT", content: "Toimistotarvikkeet kuten paperit, kynät ja muut toimistotarvikkeet kuuluvat myös 25,5 % ALV-kantaan. Nämä ovat täysin vähennyskelpoisia kuluja, kun ne on hankittu yritystoimintaa varten." },
];

export default function ChatProvider() {
    return (
        <div className="flex h-dvh bg-slate-50">

            {/* Sidebar – chat history */}
            <ChatHistory chatRooms={chatRooms}/>

            {/* Main chat area */}
            <div className="flex flex-1 flex-col">

                {/* Header */}
                <Header />

                {/* Messages */}
                <Messages messages={messages}/>

                {/* Input */}
                <Input messages={messages}/>
            </div>
        </div>
    );
}