'use client';

import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useRef } from "react";
import { logoutUser } from "../action";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const t = useTranslations('logoutButton');
    const [state, formAction] = useActionState(logoutUser, null);
    const searchParams = useSearchParams();
    const hasShownToast = useRef(false);
    const router = useRouter();

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    useEffect(() => {
        const message = searchParams.get('message');
        if (message === 'logged-in' && !hasShownToast.current) {
            hasShownToast.current = true;
            toast.success(t('loggedIn'));
            router.replace('/dashboard');
        }
    }, [searchParams]);

    return (
        <form action={formAction}>
            {state?.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
            )}
            <button type="submit" className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4">
                {t('logout')}
            </button>
        </form>
    );
}