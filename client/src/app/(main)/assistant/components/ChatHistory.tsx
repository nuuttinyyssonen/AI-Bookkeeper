interface ChatRoom {
    id: string;
    title: string;
    lastMessage: string;
    date: string;
}

interface Props {
    chatRooms: ChatRoom[];
}

export default function ChatHistory({chatRooms}: Props) {
    return (
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white sm:flex">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                <span className="text-sm font-semibold text-slate-900">Conversations</span>
                <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white hover:bg-teal-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                {chatRooms.map((room) => (
                    <button
                        key={room.id}
                        className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-50 ${room.id === "1" ? "bg-teal-50 border-r-2 border-teal-600" : ""}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${room.id === "1" ? "text-teal-700" : "text-slate-800"}`}>
                                {room.title}
                            </span>
                            <span className="text-xs text-slate-400">{room.date}</span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-slate-400">{room.lastMessage}</p>
                    </button>
                ))}
            </div>

            <div className="border-t border-slate-100 px-4 py-3">
                <p className="text-xs text-slate-400">3 conversations</p>
            </div>
        </aside>
    )
}