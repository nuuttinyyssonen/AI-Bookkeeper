'use client';

import { useTranslations } from 'next-intl';
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ChatRoom {
    id: string;
    title: string | null;
    user_id: string;
    created_at: string;
}

interface Props {
    chatRooms: ChatRoom[];
    activeChatId?: string | null;
    onDelete: (id: string) => void;
}

export default function ChatHistory({ chatRooms, activeChatId, onDelete }: Props) {
    const t = useTranslations('chatHistory');
    const router = useRouter();

    return (
        <aside className="w-64 flex-none border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <Link
                    href="/assistant"
                    className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:border-teal-400 hover:text-teal-600 hover:dark:text-teal-300"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('newChat')}
                </Link>
            </div>
            <div className="px-3 py-3">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1">{t('recent')}</p>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 pb-2">
                {chatRooms.map((room) => (
                    <div
                        key={room.id}
                        data-testid="chat-room-item"
                        onClick={() => router.push(`/assistant/${room.id}`)}
                        className={`group flex flex-col gap-0.5 rounded-xl px-3 py-2.5 mb-1 transition-colors cursor-pointer ${
                            activeChatId === room.id
                                ? "bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-200"
                                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 hover:dark:bg-slate-800"
                        }`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium truncate">{room.title ?? t('unnamedChat')}</span>
                            <div className="flex items-center gap-1 flex-none">
                                <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(room.created_at).toLocaleDateString("fi-FI")}</span>
                                <button
                                    data-testid="delete-chat-room"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(room.id);
                                    }}
                                    style={{ cursor: "pointer" }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 hover:dark:bg-red-900 hover:text-red-500 hover:dark:text-red-400 text-slate-400 dark:text-slate-500"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}