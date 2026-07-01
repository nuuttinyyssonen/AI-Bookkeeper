"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteAccount } from "../action";

const CONFIRM_PHRASE = "DELETE";

export default function Footer() {
    const [confirming, setConfirming] = useState(false);
    const [input, setInput] = useState("");

    function handleDeleteClick() {
        setConfirming(true);
    }

    function handleCancel() {
        setConfirming(false);
        setInput("");
    }

    async function handleConfirm() {
        const result = await deleteAccount();
        if (result?.error) {
            setConfirming(false);
            setInput("");
        }
    }

    return (
        <div>
            <div className="rounded-lg border border-red-200 bg-white p-6 space-y-3">
                <h2 className="text-sm font-medium text-slate-950">Danger zone</h2>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. Your subscription will be cancelled immediatelly. This action cannot be undone.</p>

                {confirming ? (
                    <div className="space-y-3">
                        <p className="text-sm text-slate-700">
                            Type <span className="font-mono font-semibold">{CONFIRM_PHRASE}</span> to confirm deletion.
                        </p>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={CONFIRM_PHRASE}
                            className="h-9 w-full max-w-xs px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleConfirm}
                                disabled={input !== CONFIRM_PHRASE}
                                className="h-9 px-4 rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Confirm deletion
                            </button>
                            <button
                                onClick={handleCancel}
                                className="h-9 px-4 rounded-md border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleDeleteClick}
                        className="h-9 px-4 rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                    >
                        Delete account
                    </button>
                )}
            </div>

            <div className="text-center">
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-slate-700 underline">
                    Back to dashboard
                </Link>
            </div>
        </div>
    );
};
