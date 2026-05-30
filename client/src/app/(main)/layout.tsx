import MainNavigation from "@/components/main-navigation";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-slate-100 text-slate-950">
            <div className="flex min-h-screen">
                <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
                            AB
                        </div>
                        <div>
                            <p className="text-sm font-semibold">AI Bookkeeper</p>
                            <p className="text-xs text-slate-500">Finance workspace</p>
                        </div>
                    </div>

                    <nav className="mt-8 space-y-1">
                        <MainNavigation variant="sidebar" />
                    </nav>

                    <div className="mt-8 rounded-md border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold">Monthly close</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            8 items left before the books are ready for review.
                        </p>
                        <div className="mt-4 h-2 rounded-full bg-slate-200">
                            <div className="h-2 w-2/3 rounded-full bg-teal-600" />
                        </div>
                    </div>
                </aside>

                <section className="flex min-w-0 flex-1 flex-col">
                    <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:hidden">
                        <MainNavigation variant="mobile" />
                    </nav>

                    {children}
                </section>
            </div>
        </main>
    );
};
