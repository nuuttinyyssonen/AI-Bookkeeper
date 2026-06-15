import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
    isProcessing: boolean;
    query: string;
    setQuery: (query: string) => void;
}

export default function ReceiptsHeader({ isProcessing, query, setQuery }: Props) {
    return (
        <div className="mb-6 flex items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-semibold">Receipts</h1>
                <p className="mt-1 text-sm text-slate-600">Your uploaded receipts and parsed totals.</p>
                {isProcessing && (
                    <p className="mt-1 text-sm text-teal-600 animate-pulse">Processing documents...</p>
                )}
            </div>

            <div className="flex w-full max-w-md items-center gap-3 lg:w-auto">
                <Input
                    placeholder="Search vendor..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button onClick={() => setQuery("")}>Clear</Button>
            </div>
        </div>
    );
};