import { ReactNode } from "react";

export default function Callout({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="my-6 border-y border-slate-200 py-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal-600">{label}</p>
            <div className="space-y-2 text-slate-600">{children}</div>
        </div>
    );
}
