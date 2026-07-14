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
        <nav className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-sm">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "rounded-md px-3 py-1.5 font-medium transition-colors",
                        pathname === link.href
                            ? "bg-slate-950 text-white"
                            : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
