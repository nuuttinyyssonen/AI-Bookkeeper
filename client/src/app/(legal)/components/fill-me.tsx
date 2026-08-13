import { ReactNode } from "react";

export default function FillMe({ children }: { children: ReactNode }) {
    return (
        <span className="border-b border-dashed border-amber-400 dark:border-amber-500 italic text-amber-700 dark:text-amber-200">
            {children}
            <span className="ml-1.5 font-mono text-[11px] not-italic tracking-wide text-amber-500 dark:text-amber-400">
                · 17.7.2026
            </span>
        </span>
    );
}
