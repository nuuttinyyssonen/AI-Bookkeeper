"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Receipts", href: "/receipts" },
    { label: "Reports", href: "/reports" },
    { label: "AI assistant", href: "/assistant" },
    { label: "Settings", href: "/settings" },
];

type MainNavigationProps = {
    variant: "sidebar" | "mobile";
};

export default function MainNavigation({ variant }: MainNavigationProps) {
    const pathname = usePathname();

    if (variant === "mobile") {
        const activeItem = navigationItems.find((item) => (
            pathname === item.href || pathname.startsWith(`${item.href}/`)
        )) ?? navigationItems[0];

        return (
            <details className="w-full">
                <summary className="list-none [&::-webkit-details-marker]:hidden">
                    <div className="flex cursor-pointer items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
                                AB
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">AI Bookkeeper</p>
                                <p className="truncate text-xs text-slate-500">{activeItem.label}</p>
                            </div>
                        </div>

                        <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700">
                            Menu
                        </span>
                    </div>
                </summary>

                <div
                    id="mobile-main-navigation"
                    className="mt-3 grid gap-1 rounded-md border border-slate-200 bg-white p-2 shadow-sm"
                >
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`rounded-md px-3 py-2 text-sm font-medium ${
                                    isActive
                                        ? "bg-slate-950 text-white"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </details>
        );
    }

    return (
        <>
            {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex h-10 items-center rounded-md px-3 text-sm font-medium transition ${
                            isActive
                                ? "bg-slate-950 text-white"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                        }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </>
    );
};
