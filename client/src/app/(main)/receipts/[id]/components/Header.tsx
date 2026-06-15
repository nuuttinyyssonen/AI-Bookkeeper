import Link from "next/link";

export default function Header() {
    return (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Receipt details</h1>
            <p className="mt-1 text-sm text-slate-600">Review the full receipt, image, and action options.</p>
          </div>
          <Link href="/receipts" className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-50">
            Back to receipts
          </Link>
        </div>
    );
};