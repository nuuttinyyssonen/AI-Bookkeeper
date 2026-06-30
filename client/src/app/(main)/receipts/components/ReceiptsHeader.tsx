import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
    isProcessing: boolean;
    query: string;
    setQuery: (query: string) => void;
    from: string;
    setFrom: (from: string) => void;
    to: string;
    setTo: (to: string) => void;
    onClear: () => void;
}

export default function ReceiptsHeader({ isProcessing, query, setQuery, from, setFrom, to, setTo, onClear }: Props) {
    return (
        <div className="mb-6 flex flex-col gap-4">
            <div>
                <h1 className="text-3xl font-semibold">Receipts</h1>
                <p className="mt-1 text-sm text-slate-600">Your uploaded receipts and parsed totals.</p>
                {isProcessing && (
                    <p className="mt-1 text-sm text-teal-600 animate-pulse">Processing documents...</p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Input
                    className="w-56"
                    placeholder="Search vendor..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="h-9 rounded-md border border-slate-200 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-400">to</span>
                <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="h-9 rounded-md border border-slate-200 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Button variant="outline" onClick={onClear}>Clear</Button>
            </div>
        </div>
    );
};