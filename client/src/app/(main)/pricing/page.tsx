import Link from "next/link";

export default function Page() {
    return (
        <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#fff7ed_100%)] px-4 py-8">
            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-semibold text-slate-950">Choose your plan</h1>
                    <p className="text-sm text-muted-foreground">Upgrade or downgrade at any time</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">

                    <div className="relative rounded-lg border border-border bg-white p-6 space-y-4">
                        <div>
                            <p className="text-base font-medium text-slate-950">Basic</p>
                            <div className="mt-2">
                                <span className="text-3xl font-semibold text-slate-950">€19.99</span>
                                <span className="text-sm text-muted-foreground ml-1">/ mo</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">For individuals and freelancers</p>
                        </div>

                        <ul className="space-y-2">
                            {['Unlimited receipts', 'AI bookkeeper', 'Monthly reports', 'Email support'].map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <svg className="w-4 h-4 text-teal-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className="w-full h-10 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            Select Basic
                        </button>
                    </div>

                    <div className="relative rounded-lg border-2 border-teal-700 bg-white p-6 space-y-4">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                                Most popular
                            </span>
                        </div>

                        <div>
                            <p className="text-base font-medium text-slate-950">Premium</p>
                            <div className="mt-2">
                                <span className="text-3xl font-semibold text-slate-950">€39.99</span>
                                <span className="text-sm text-muted-foreground ml-1">/ mo</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">For small businesses</p>
                        </div>

                        <ul className="space-y-2">
                            {['Everything in Basic', 'Priority support', 'Advanced analytics', 'Multi-user access'].map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <svg className="w-4 h-4 text-teal-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className="w-full h-10 rounded-md bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800 transition-colors">
                            Select Premium
                        </button>
                    </div>

                </div>

                <div className="text-center">
                    <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-slate-700 underline">
                        Back to dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}