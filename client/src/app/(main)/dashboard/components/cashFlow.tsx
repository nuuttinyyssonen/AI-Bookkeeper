import { getTranslations } from 'next-intl/server';

interface Props {
    cashflow: { month: string; income: number; expense: number; }[]
}

export default async function Cashflow({ cashflow }: Props) {
    const t = await getTranslations('cashflow');
    const maxValue = Math.max(...cashflow.map(item => Math.max(Number(item.income), Number(item.expense))));
    const toPercent = (value: number) => maxValue === 0 ? 0 : Math.round((Number(value) / maxValue) * 100);

    return (
        <section className="rounded-md border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">{t('title')}</h2>
                    <p className="text-sm text-slate-500">{t('subtitle')}</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-teal-600" />{t('income')}</span>
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />{t('expenses')}</span>
                </div>
            </div>
            <div className="mt-6 overflow-x-auto">
                <div className="grid h-72 grid-cols-6 items-end gap-1.5 border-b border-slate-200 pb-4 sm:min-w-[34rem] sm:gap-3">
                    {cashflow.map((item) => (
                        <div key={item.month} className="flex h-full flex-col justify-end gap-3">
                            <div className="flex flex-1 items-end justify-center gap-1 sm:gap-2">
                                <div className="w-2.5 rounded-t-md bg-teal-600 sm:w-5" style={{ height: `${toPercent(item.income)}%` }} />
                                <div className="w-2.5 rounded-t-md bg-amber-500 sm:w-5" style={{ height: `${toPercent(item.expense)}%` }} />
                            </div>
                            <p className="text-center text-xs font-medium text-slate-500">{item.month}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}