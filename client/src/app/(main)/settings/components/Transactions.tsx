export default function Transactions() {
    return (
        <div className="rounded-lg border border-border bg-white p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-950">Payment history</h2>
            <div className="divide-y divide-border">
                {[
                    { date: '24.6.2026', amount: '€19.99', status: 'Paid', description: 'Basic — monthly' },
                    { date: '24.5.2026', amount: '€19.99', status: 'Paid', description: 'Basic — monthly' },
                    { date: '24.4.2026', amount: '€19.99', status: 'Paid', description: 'Basic — monthly' },
                ].map((payment, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-medium text-slate-950">{payment.description}</p>
                            <p className="text-xs text-muted-foreground">{payment.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                                {payment.status}
                            </span>
                            <p className="text-sm font-medium text-slate-950">{payment.amount}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};