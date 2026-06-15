import { authenticateUser } from "@/lib/auth";
import { getReportById } from "./action";
import { notFound } from "next/navigation";

import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import SalesVatBreakdown from "./components/SalesVatBreakdown";
import PurchasesVatBreakdown from "./components/PurchasesVatBreakdown";
import VatReturned from "./components/VatReturned";

export default async function ReportPage({ params }: { params: { id: string } }) {
    await authenticateUser();
    const { id } = await params;
    const report = await getReportById(id);

    if (!report) return notFound();

    const vatBreakdown = report.vat_breakdown as {
        sales: { rate: number; net: number; vat_amount: number; gross: number }[];
        purchases: { rate: number; net: number; vat_amount: number; gross: number }[];
    };

    const isRefund = Number(report.vat_payable) < 0;

    return (
        <div className="min-h-screen bg-slate-50">
            <Header report={report} id={id}/>
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
                <SummaryCards report={report} isRefund={isRefund}/>
                <SalesVatBreakdown vatBreakdown={vatBreakdown} report={report} />
                <PurchasesVatBreakdown vatBreakdown={vatBreakdown} report={report} />
                <VatReturned report={report}/>
            </div>
        </div>
    );
};