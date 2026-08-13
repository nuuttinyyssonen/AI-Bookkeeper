import Link from "next/link";

interface Props {
  title: string;
  description?: string;
  link?: { href: string; label: string; className?: string };
  centered?: boolean;
}

export default function StatusCard({ title, description, link, centered }: Props) {
  return (
    <div className="px-6 py-8">
      <div className={`mx-auto max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-8 shadow-sm ${centered ? "text-center" : ""}`}>
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</p>
        {description && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        {link && (
          <Link href={link.href} className={`mt-6 inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-white ${link.className ?? "bg-slate-950 dark:bg-slate-800 hover:bg-slate-800 hover:dark:bg-slate-700"}`}>
            {link.label}
          </Link>
        )}
      </div>
    </div>
  );
}