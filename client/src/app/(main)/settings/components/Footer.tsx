"use client";

import Link from "next/link";
import { useEffect, useState, useActionState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { deleteAccount } from "../action";

const CONFIRM_PHRASE = "DELETE";

export default function Footer() {
    const t = useTranslations('settingsFooter');
    const [confirming, setConfirming] = useState(false);
    const [input, setInput] = useState("");
    const [state, formAction, isPending] = useActionState(deleteAccount, undefined);

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
            setConfirming(false);
            setInput("");
        }
    }, [state]);

    function handleDeleteClick() {
        setConfirming(true);
    }

    function handleCancel() {
        setConfirming(false);
        setInput("");
    }

    return (
        <div>
            <div className="rounded-lg border border-red-200 dark:border-red-700 bg-white dark:bg-slate-950 p-6 space-y-3">
                <h2 className="text-sm font-medium text-slate-950 dark:text-slate-50">{t('dangerZone')}</h2>
                <p className="text-sm text-muted-foreground">{t('deleteWarning')}</p>

                {confirming ? (
                    <form action={formAction} className="space-y-3">
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                            {t.rich('typeToConfirm', {
                                phrase: (chunks) => <span className="font-mono font-semibold">{chunks}</span>,
                                value: CONFIRM_PHRASE,
                            })}
                        </p>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={CONFIRM_PHRASE}
                            className="h-9 w-full max-w-xs px-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:dark:ring-red-400"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={input !== CONFIRM_PHRASE || isPending}
                                className="h-9 px-4 rounded-md bg-red-600 dark:bg-red-700 text-sm font-medium text-white hover:bg-red-700 hover:dark:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {t('confirmDeletion')}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isPending}
                                className="h-9 px-4 rounded-md border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:dark:bg-slate-900 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={handleDeleteClick}
                        className="h-9 px-4 rounded-md bg-red-600 dark:bg-red-700 text-sm font-medium text-white hover:bg-red-700 hover:dark:bg-red-600 transition-colors"
                    >
                        {t('deleteAccount')}
                    </button>
                )}
            </div>

            <div className="text-center">
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-slate-700 hover:dark:text-slate-200 underline">
                    {t('backToDashboard')}
                </Link>
            </div>
        </div>
    );
};
