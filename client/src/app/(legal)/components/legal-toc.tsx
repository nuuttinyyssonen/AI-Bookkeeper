export type TocItem = { id: string; num: string; label: string };

export default function LegalToc({ items }: { items: TocItem[] }) {
    return (
        <>
            <details className="mb-8 rounded-lg border border-slate-200 bg-slate-50 lg:hidden">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-700">
                    Sisällysluettelo
                </summary>
                <ol className="space-y-2 px-4 pb-4">
                    {items.map((item) => (
                        <li key={item.id}>
                            <a href={`#${item.id}`} className="text-sm text-slate-500 hover:text-teal-700">
                                {item.num}. {item.label}
                            </a>
                        </li>
                    ))}
                </ol>
            </details>

            <aside className="hidden lg:block">
                <div className="sticky top-24">
                    <p className="mb-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                        Sisällys
                    </p>
                    <ol className="space-y-2.5">
                        {items.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    className="flex gap-2.5 text-sm leading-snug text-slate-500 hover:text-teal-700"
                                >
                                    <span className="tabular-nums text-slate-300">{item.num}</span>
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
            </aside>
        </>
    );
}
