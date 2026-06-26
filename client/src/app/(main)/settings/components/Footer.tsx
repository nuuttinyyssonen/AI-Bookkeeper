import Link from "next/link";

export default function Footer() {
    return (
        <div>
            <div className="rounded-lg border border-red-200 bg-white p-6 space-y-3">
                <h2 className="text-sm font-medium text-slate-950">Danger zone</h2>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button className="h-9 px-4 rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors">
                    Delete account
                </button>
            </div>

            <div className="text-center">
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-slate-700 underline">
                    Back to dashboard
                </Link>
            </div>
        </div>
    );
};