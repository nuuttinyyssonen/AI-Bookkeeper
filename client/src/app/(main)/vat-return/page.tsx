import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateUser, getVeroAuthToken } from "@/lib/auth";
import { getUserData } from "../settings/action";
import { getReports } from "../reports/action";

import VatReturnForm from "./components/VatReturnForm";
import { VeroFilingPeriod } from "@/app/types/vero";

export default async function VatReturnPage() {
    await authenticateUser();
    const t = await getTranslations('vatReturnPage');
    const veroToken = await getVeroAuthToken();

    const data = await getUserData();

    if ("error" in data) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">{data.error}</p>
            </div>
        );
    }

    const { user } = data;
    const reports = await getReports();
    const businessId = user.business_id;

    if (!veroToken) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">{t('authRequired')}</h2>
                    <p className="text-sm text-slate-600 mb-4">{t('authDescription')}</p>
                    <a href="/api/vero/authorize">
                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-semibold">
                            {t('authorizeButton')}
                        </button>
                    </a>
                </div>
            </div>
        );
    }

    const cookieStore = await cookies();
    const periodsRes = await fetch(`http://localhost:3000/api/vero/periods?businessId=${businessId}`, {
        cache: "no-store",
        headers: { Cookie: cookieStore.toString() },
    });

    if (periodsRes.status === 403) {
        redirect("/pricing?message=subscription_required");
    }

    const periodsData = periodsRes.ok ? await periodsRes.json() : null;
    const periods: VeroFilingPeriod[] = periodsData?.FilingPeriod ?? [];

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <h1 className="text-2xl font-semibold mb-6">{t('title')}</h1>
            <div className="max-w-xl bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-medium mb-4">{t('selectPeriod')}</h2>
                {periods.length === 0 ? (
                    <p className="text-sm text-slate-500">{t('noPeriodsAvailable')}</p>
                ) : (
                    <ul className="space-y-2">
                        {periods.map((p, index) => (
                            <li key={index} className="flex items-center justify-between text-sm border border-slate-100 rounded-lg px-4 py-3">
                                <span>{p.FilingPeriod}</span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.Status === "Open" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                                    {p.Status}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <VatReturnForm user={user} reports={reports} />
        </div>
    );
}