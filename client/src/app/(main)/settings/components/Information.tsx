

export default function Infromation() {
    return (
        <div className="rounded-lg border border-border bg-white p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-950">Personal information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">First name</p>
                    <p className="text-sm font-medium text-slate-950">Matti</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last name</p>
                    <p className="text-sm font-medium text-slate-950">Meikäläinen</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-slate-950">matti@example.com</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Phone number</p>
                    <p className="text-sm font-medium text-slate-950">+358 40 123 4567</p>
                </div>
            </div>
            <div className="pt-2">
                <button className="h-9 px-4 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Edit information
                </button>
            </div>
        </div>
    );
};