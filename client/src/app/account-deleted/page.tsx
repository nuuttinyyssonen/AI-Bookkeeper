import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default async function AccountDeletedPage() {
    const cookieStore = await cookies();
    if (!cookieStore.has("account_deleted")) {
        redirect("/");
    }
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 dark:from-slate-900 to-white dark:to-slate-950 px-4">
            <div className="flex flex-col items-center text-center max-w-md space-y-6">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-600 text-white">
                    <Sparkles className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Account deleted</h1>
                    <p className="text-sm text-muted-foreground">Your account and all associated data have been permanently deleted.</p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                >
                    Back to home
                </Link>
            </div>
        </main>
    );
}
