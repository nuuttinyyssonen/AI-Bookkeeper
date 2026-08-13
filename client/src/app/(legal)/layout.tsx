import Link from "next/link";
import { Sparkles } from "lucide-react";
import LegalDocNav from "./components/legal-doc-nav";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-600 text-white">
                            <Sparkles className="h-4 w-4" />
                        </span>
                        <span>AI Bookkeeper</span>
                    </Link>
                    <LegalDocNav />
                </div>
            </header>

            <main>{children}</main>

            <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 dark:text-slate-400 sm:flex-row">
                    <span>© {new Date().getFullYear()} AI Bookkeeper</span>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-slate-900 hover:dark:text-slate-50">Tietosuojaseloste</Link>
                        <Link href="/terms" className="hover:text-slate-900 hover:dark:text-slate-50">Käyttöehdot</Link>
                        <a href="mailto:nuutti.nyyssonen@gmail.com" className="hover:text-slate-900 hover:dark:text-slate-50">Ota yhteyttä</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
