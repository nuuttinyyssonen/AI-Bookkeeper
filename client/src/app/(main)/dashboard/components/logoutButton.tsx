'use client';

import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useRef } from "react";
import { logoutUser } from "../action";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const t = useTranslations('logoutButton');
    const tDemo = useTranslations('demo');
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

    const handleLogout = () => {
        toast.error(tDemo('logoutBlocked'));
    }

    return (
        <>
            {state?.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
            )}
            <button onClick={handleLogout} type="submit" className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4">
                {t('logout')}
            </button>
        </>
    );
}