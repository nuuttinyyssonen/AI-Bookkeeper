"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    const [isOpen, setIsOpen] = useState(false);

    if (variant === "mobile") {
        const activeItem = navigationItems.find((item) => (
            pathname === item.href || pathname.startsWith(`${item.href}/`)
        )) ?? navigationItems[0];

        return (
            <div className="w-full">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
                            AB
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">AI Bookkeeper</p>
                            <p className="truncate text-xs text-slate-500">{activeItem.label}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOpen((current) => !current)}
                        className="h-10 shrink-0 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700"
                        aria-expanded={isOpen}
                        aria-controls="mobile-main-navigation"
                    >
                        Menu
                    </button>
                </div>

                {isOpen && (
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
                                    onClick={() => setIsOpen(false)}
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
                )}
            </div>
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
