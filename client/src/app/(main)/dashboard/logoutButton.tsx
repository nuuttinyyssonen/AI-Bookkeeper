'use client';
import { useActionState } from "react";
import { logoutUser } from "./action";

export default function LogoutButton() {
    const [state, formAction] = useActionState(logoutUser, null);

    return (
        <form action={formAction}>
            {state?.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
            )}
            <button type="submit" className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4">
                Logout
            </button>
        </form>
    );
}