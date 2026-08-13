import { getTranslations } from 'next-intl/server';

interface Props {
    data: {
        revenue: number;
        expenses: number;
        net_profit: number;
    }
}

export default async function FinancialSummary({ data }: Props) {
    const t = await getTranslations('financialSummary');

    const stats = [
        { label: t('revenue'), value: `${Number(data.revenue).toFixed(2)} €`, accent: "bg-teal-600" },
        { label: t('expenses'), value: `${Number(data.expenses).toFixed(2)} €`, accent: "bg-rose-500 dark:bg-rose-400" },
        { label: t('netProfit'), value: `${Number(data.net_profit).toFixed(2)} €`, accent: "bg-slate-900 dark:bg-slate-50" },
    ];

    return (
        <div>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat) => (
                    <article key={stat.label} className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5">
                        <div className={`h-1.5 w-12 rounded-full ${stat.accent}`} />
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                        <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                    </article>
                ))}
            </section>
        </div>
    );
}