interface Props {
    history: any
};

export default function Transactions({ history }: Props) {
    return (
        <div className="rounded-lg border border-border bg-white p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-950">Payment history</h2>
            <div className="divide-y divide-border">
                {history.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between py-3">
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