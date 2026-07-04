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
            <section className="rounded-md border border-slate-200 bg-white">
                <div className="border-b border-slate-200 p-5">
                    <h2 className="text-lg font-semibold">{t('title')}</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                            <div>
                                <p className="font-medium">{transaction.vendor_name}</p>
                                <p className="text-sm text-slate-500">
                                    {new Date(transaction.receipt_date).toLocaleDateString("fi-FI")}
                                </p>
                            </div>
                            <p className={`font-semibold ${transaction.receipt_type === "INCOME" ? "text-teal-700" : "text-slate-700"}`}>
                                {transaction.receipt_type === "INCOME" ? "+" : "-"}{Number(transaction.total_amount).toFixed(2)} €
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}