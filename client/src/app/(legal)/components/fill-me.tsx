import { ReactNode } from "react";

export default function FillMe({ children }: { children: ReactNode }) {
    return (
        <span className="border-b border-dashed border-amber-400 italic text-amber-700">
            {children}
            <span className="ml-1.5 font-mono text-[11px] not-italic tracking-wide text-amber-500">
                · täydennä
            </span>
        </span>
    );
}
