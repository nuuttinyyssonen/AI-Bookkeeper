import { ReactNode } from "react";

export default function LegalSection({
    id,
    num,
    title,
    children,
}: {
    id: string;
    num: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-24 py-10 first:pt-0">
            <div className="mb-4 flex items-baseline gap-3">
                <span className="font-mono text-sm tabular-nums text-teal-600">{num}</span>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
            </div>
            <div className="space-y-4 leading-relaxed text-slate-600 [&_a]:text-teal-700 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-teal-800 [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-slate-900">
                {children}
            </div>
        </section>
    );
}
