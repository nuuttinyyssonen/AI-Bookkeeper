const stats = [
    { label: "Revenue", value: "24,820 EUR", change: "+12.4%", accent: "bg-teal-600" },
    { label: "Expenses", value: "8,940 EUR", change: "-3.1%", accent: "bg-rose-500" },
    { label: "Net profit", value: "15,880 EUR", change: "+8.7%", accent: "bg-slate-900" },
    { label: "Open invoices", value: "6", change: "2 overdue", accent: "bg-amber-500" },
];

const cashflow = [
    { month: "Jan", income: 58, expense: 38 },
    { month: "Feb", income: 72, expense: 46 },
    { month: "Mar", income: 64, expense: 42 },
    { month: "Apr", income: 86, expense: 53 },
    { month: "May", income: 78, expense: 48 },
    { month: "Jun", income: 92, expense: 56 },
];

const transactions = [
    { name: "Nordic Design Studio", category: "Invoice paid", amount: "+3,240 EUR", tone: "text-teal-700" },
    { name: "Cloud hosting", category: "Software", amount: "-148 EUR", tone: "text-slate-700" },
    { name: "Office supplies", category: "Operations", amount: "-86 EUR", tone: "text-slate-700" },
    { name: "Consulting retainer", category: "Invoice paid", amount: "+5,500 EUR", tone: "text-teal-700" },
];

import { logoutUser } from "./action";
import { authenticateUser } from "@/lib/auth";

export default async function Page() {
    await authenticateUser();
    
    return (
        <>
            <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-teal-700">Dashboard</p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
                            Business overview
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto">
                        <button onClick={logoutUser} className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            Logout
                        </button>
                        <button className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            Export
                        </button>
                        <button className="h-10 rounded-md bg-teal-600 px-4 text-sm font-semibold text-white hover:bg-teal-700">
                            Add receipt
                        </button>
                    </div>
                </div>
            </header>

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <article key={stat.label} className="rounded-md border border-slate-200 bg-white p-5">
                            <div className={`h-1.5 w-12 rounded-full ${stat.accent}`} />
                            <p className="mt-4 text-sm text-slate-500">{stat.label}</p>
                            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                            <p className="mt-2 text-sm text-slate-500">{stat.change}</p>
                        </article>
                    ))}
                </section>

                <section className="rounded-md border border-slate-200 bg-white p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Cashflow</h2>
                            <p className="text-sm text-slate-500">Income and expense trend</p>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-teal-600" />Income</span>
                            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Expenses</span>
                        </div>
                    </div>

                    <div className="mt-6 grid h-72 grid-cols-6 items-end gap-3 border-b border-slate-200 pb-4">
                        {cashflow.map((item) => (
                            <div key={item.month} className="flex h-full flex-col justify-end gap-3">
                                <div className="flex flex-1 items-end justify-center gap-2">
                                    <div className="w-5 rounded-t-md bg-teal-600" style={{ height: `${item.income}%` }} />
                                    <div className="w-5 rounded-t-md bg-amber-500" style={{ height: `${item.expense}%` }} />
                                </div>
                                <p className="text-center text-xs font-medium text-slate-500">{item.month}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-md border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 p-5">
                        <h2 className="text-lg font-semibold">Recent transactions</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {transactions.map((transaction) => (
                            <div key={transaction.name} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                                <div>
                                    <p className="font-medium">{transaction.name}</p>
                                    <p className="text-sm text-slate-500">{transaction.category}</p>
                                </div>
                                <p className={`font-semibold ${transaction.tone}`}>{transaction.amount}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};
