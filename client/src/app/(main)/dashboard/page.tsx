// for demot this is client component

import { getTranslations } from 'next-intl/server';
import { authenticateUser } from "@/lib/auth";
import { getCashFlowData, getDashboardData } from "./action";
import Link from "next/link";
import { toast } from 'sonner';

import Cashflow from "./components/cashFlow";
import FinancialSummary from "./components/FinancialSummary";
import Transactions from "./components/Transactions";
import LogoutButton from "./components/logoutButton";
import SubscriptionBanner from "./components/SubscriptionBanner";
import DemoBanner from './components/DemoBanner';
import DemoButton from './components/DemoButton';

import { redirect } from "next/navigation";

export default async function Page() {
    await authenticateUser();
    const t = await getTranslations('dashboard');
    const { cashflow } = await getCashFlowData();
    const data = await getDashboardData();
    // const { subscription } = await getSubscriptionData();

    if (!data || 'error' in data) {
        redirect("/login");
    }

    return (
        <>
            <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-teal-700">{t('label')}</p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
                            {t('title')}
                        </h1>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
                        <LogoutButton />
                        {/* <button data-testid="export-button" className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4">
                            {t('export')}
                        </button> */}
                        <DemoButton />
                        {/* <Link href="/upload" data-testid="upload-link" className="h-10 w-full rounded-md bg-teal-600 px-3 text-sm font-semibold text-white hover:bg-teal-700 sm:w-auto sm:px-4 flex items-center justify-center">
                            {t('addReceipt')}
                        </Link> */}
                    </div>
                </div>
            </header>

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {/* <SubscriptionBanner subscription={subscription} /> */}
                <DemoBanner />
                <FinancialSummary data={data} />
                <Cashflow cashflow={cashflow} />
                <Transactions transactions={data.recent_receipts} />
            </div>
        </>
    );
}