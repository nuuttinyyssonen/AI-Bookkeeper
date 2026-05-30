"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Receipts", href: "/receipts" },
    { label: "Reports", href: "/reports" },
    { label: "AI assistant", href: "/ai-assistant" },
    { label: "Settings", href: "/settings" },
];

type MainNavigationProps = {
    variant: "sidebar" | "mobile";
};

export default function MainNavigation({ variant }: MainNavigationProps) {
    const pathname = usePathname();

    return (
        <>
            {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const baseClass = variant === "sidebar"
                    ? "flex h-10 items-center rounded-md px-3 text-sm font-medium transition"
                    : "shrink-0 rounded-md px-3 py-2 text-sm font-medium";
                const inactiveClass = variant === "sidebar"
                    ? "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    : "bg-slate-100 text-slate-600";

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`${baseClass} ${isActive ? "bg-slate-950 text-white" : inactiveClass}`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </>
    );
};
