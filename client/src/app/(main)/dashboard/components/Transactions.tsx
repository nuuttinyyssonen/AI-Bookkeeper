import { getTranslations } from 'next-intl/server';

interface Receipt {
    id: string;
    vendor_name: string;
    total_amount: number;
    receipt_date: string;
    receipt_type: "INCOME" | "EXPENSE";
}

interface Props {
    transactions: Receipt[];
}

export default async function Transactions({ transactions }: Props) {
    const t = await getTranslations('transactions');

    return (
        <div>
            <section className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950">
                <div className="border-b border-slate-200 dark:border-slate-700 p-5">
                    <h2 className="text-lg font-semibold">{t('title')}</h2>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                            <div>
                                <p className="font-medium">{transaction.vendor_name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {new Date(transaction.receipt_date).toLocaleDateString("fi-FI")}
                                </p>
                            </div>
                            <p className={`font-semibold ${transaction.receipt_type === "INCOME" ? "text-teal-700 dark:text-teal-200" : "text-slate-700 dark:text-slate-200"}`}>
                                {transaction.receipt_type === "INCOME" ? "+" : "-"}{Number(transaction.total_amount).toFixed(2)} €
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}