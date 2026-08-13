'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
    { href: "/privacy", label: "Tietosuojaseloste" },
    { href: "/terms", label: "Käyttöehdot" },
];

export default function LegalDocNav() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-1 text-sm">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "rounded-md px-3 py-1.5 font-medium transition-colors",
                        pathname === link.href
                            ? "bg-slate-950 dark:bg-slate-800 text-white"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:dark:text-slate-50"
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
