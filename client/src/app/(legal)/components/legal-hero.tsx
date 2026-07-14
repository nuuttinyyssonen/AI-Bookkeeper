import { ReactNode } from "react";

export default function LegalHero({
    eyebrow,
    title,
    description,
    meta,
}: {
    eyebrow: string;
    title: string;
    description: string;
    meta?: ReactNode;
}) {
    return (
        <div className="border-b border-slate-200 bg-gradient-to-b from-teal-50 to-white">
            <div className="mx-auto max-w-5xl px-6 py-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                    {eyebrow}
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-slate-900 md:text-4xl">
                    {title}
                </h1>
                <p className="mt-3 max-w-2xl text-slate-500">{description}</p>
                {meta && <div className="mt-5 flex flex-wrap gap-2">{meta}</div>}
            </div>
        </div>
    );
}
