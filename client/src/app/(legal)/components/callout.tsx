import { ReactNode } from "react";

export default function Callout({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="my-6 border-y border-slate-200 dark:border-slate-700 py-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-300">{label}</p>
            <div className="space-y-2 text-slate-600 dark:text-slate-300">{children}</div>
        </div>
    );
}
