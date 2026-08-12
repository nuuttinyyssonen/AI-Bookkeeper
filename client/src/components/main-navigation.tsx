"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import LanguageSwitcher from "./LanguageSwitcher";

const navigationItems = [
    { key: "dashboard", href: "/dashboard" },
    { key: "receipts", href: "/receipts" },
    { key: "upload", href: "/upload" },
    { key: "reports", href: "/reports" },
    { key: "vatReturn", href: "/vat-return" },
    { key: "assistant", href: "/assistant" },
    { key: "settings", href: "/settings" },
] as const;

type MainNavigationProps = {
    variant: "sidebar" | "mobile";
};

export default function MainNavigation({ variant }: MainNavigationProps) {
    const t = useTranslations('mainNavigation');
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    if (variant === "mobile") {
        const activeItem = navigationItems.find((item) =>
            pathname === item.href || pathname.startsWith(`${item.href}/`)
        ) ?? navigationItems[0];

        return (
            <div className="relative w-full">
                <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((open) => !open)}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
                            AB
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">AI Bookkeeper</p>
                            <p className="truncate text-xs text-slate-500">{t(activeItem.key)}</p>
                        </div>
                    </div>
                    <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700">
                        <svg
                            className={`h-4 w-4 transition-transform duration-200 ease-out ${isOpen ? "rotate-180" : "rotate-0"}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="ml-2">{t('menu')}</span>
                    </span>
                </button>

                <div
                    className={`absolute inset-x-0 top-full z-30 mt-3 origin-top transition-all duration-200 ease-out ${
                        isOpen
                            ? "translate-y-0 scale-100 opacity-100"
                            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
                    }`}
                >
                    <div
                        aria-hidden={!isOpen}
                        className="grid gap-1 rounded-md border border-slate-200 bg-white p-2 shadow-sm"
                    >
                        {navigationItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    tabIndex={isOpen ? undefined : -1}
                                    onClick={() => setIsOpen(false)}
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                                        isActive
                                            ? "bg-slate-950 text-white"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                    }`}
                                >
                                    {t(item.key)}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                    <Link
                        key={item.key}
                        href={item.href}
                        className={`flex h-10 items-center rounded-md px-3 text-sm font-medium transition ${
                            isActive
                                ? "bg-slate-950 text-white"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                        }`}
                    >
                        {t(item.key)}
                    </Link>
                );
            })}
            <LanguageSwitcher />
        </>
    );
}