export type TocItem = { id: string; num: string; label: string };

export default function LegalToc({ items }: { items: TocItem[] }) {
    return (
        <>
            <details className="mb-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 lg:hidden">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    Sisällysluettelo
                </summary>
                <ol className="space-y-2 px-4 pb-4">
                    {items.map((item) => (
                        <li key={item.id}>
                            <a href={`#${item.id}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-teal-700 hover:dark:text-teal-200">
                                {item.num}. {item.label}
                            </a>
                        </li>
                    ))}
                </ol>
            </details>

            <aside className="hidden lg:block">
                <div className="sticky top-24">
                    <p className="mb-4 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Sisällys
                    </p>
                    <ol className="space-y-2.5">
                        {items.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    className="flex gap-2.5 text-sm leading-snug text-slate-500 dark:text-slate-400 hover:text-teal-700 hover:dark:text-teal-200"
                                >
                                    <span className="tabular-nums text-slate-300 dark:text-slate-600">{item.num}</span>
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
