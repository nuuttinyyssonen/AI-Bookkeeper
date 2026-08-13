import { AlertTriangle } from "lucide-react";

export default function DraftBanner({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-10 flex gap-3 rounded-lg border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-600 dark:text-amber-300" />
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-200">Luonnos</p>
                <p className="mt-1 text-sm leading-relaxed text-amber-800 dark:text-amber-100">{children}</p>
            </div>
        </div>
    );
}
