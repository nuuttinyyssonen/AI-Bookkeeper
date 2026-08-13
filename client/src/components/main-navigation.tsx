"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

const navigationItems = [
    { key: "dashboard", href: "/dashboard" },
    { key: "receipts", href: "/receipts" },
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

    if (variant === "mobile") {
        const activeItem = navigationItems.find((item) =>
            pathname === item.href || pathname.startsWith(`${item.href}/`)
        ) ?? navigationItems[0];

        return (
            <details className="w-full">
                <summary className="list-none [&::-webkit-details-marker]:hidden">
                    <div className="flex cursor-pointer items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-950 dark:bg-slate-800 text-sm font-bold text-white">
                                AB
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">AI Bookkeeper</p>
                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{t(activeItem.key)}</p>
                            </div>
                        </div>
                        <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                            {t('menu')}
                        </span>
                    </div>
                </summary>

                <div className="mt-3 grid gap-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 shadow-sm">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`rounded-md px-3 py-2 text-sm font-medium ${
                                    isActive
                                        ? "bg-slate-950 dark:bg-slate-800 text-white"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:dark:bg-slate-800 hover:text-slate-950 hover:dark:text-slate-50"
                                }`}
                            >
                                {t(item.key)}
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
                        key={item.key}
                        href={item.href}
                        className={`flex h-10 items-center rounded-md px-3 text-sm font-medium transition ${
                            isActive
                                ? "bg-slate-950 dark:bg-slate-800 text-white"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:dark:bg-slate-800 hover:text-slate-950 hover:dark:text-slate-50"
                        }`}
                    >
                        {t(item.key)}
                    </Link>
                );
            })}
            <LanguageSwitcher />
            <ThemeToggle />
        </>
    );
}