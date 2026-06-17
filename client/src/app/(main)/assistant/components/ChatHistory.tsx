'use client';
import Link from "next/link";

interface ChatRoom {
    id: string;
    title: string | null;
    user_id: string;
    created_at: string;
}

interface Props {
    chatRooms: ChatRoom[];
    activeChatId?: string | null;
}

export default function ChatHistory({ chatRooms, activeChatId }: Props) {
    return (
        <aside className="w-64 flex-none border-r border-slate-200 bg-white flex flex-col">
            <div className="p-4 border-b border-slate-200">
                <Link
                    href="/assistant"
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-teal-400 hover:text-teal-600"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Uusi chat
                </Link>
            </div>
            <div className="px-3 py-3">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 mb-1">Viimeisimmät</p>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 pb-2">
                {chatRooms.map((room) => (
                    <Link
                        key={room.id}
                        href={`/assistant/${room.id}`}
                        className={`flex flex-col gap-0.5 rounded-xl px-3 py-2.5 mb-1 transition-colors ${
                            activeChatId === room.id
                                ? "bg-teal-50 text-teal-700"
                                : "text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium truncate">{room.title}</span>
                            <span className="text-xs text-slate-400 flex-none">{room.created_at}</span>
                        </div>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}