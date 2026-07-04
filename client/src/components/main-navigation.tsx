"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

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
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
                                AB
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">AI Bookkeeper</p>
                                <p className="truncate text-xs text-slate-500">{t(activeItem.key)}</p>
                            </div>
                        </div>
                        <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700">
                            {t('menu')}
                        </span>
                    </div>
                </summary>

                <div className="mt-3 grid gap-1 rounded-md border border-slate-200 bg-white p-2 shadow-sm">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
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
                                ? "bg-slate-950 text-white"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                        }`}
                    >
                        {t(item.key)}
                    </Link>
                );
            })}
        </>
    );
}