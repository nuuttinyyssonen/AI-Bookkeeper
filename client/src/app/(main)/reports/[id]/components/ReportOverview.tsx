'use client';

import Header from "./Header";
import SummaryCards from "./SummaryCards";
import SalesVatBreakdown from "./SalesVatBreakdown";
import VatReturned from "./VatReturned";
import PurchasesVatBreakdown from "./PurchasesVatBreakdown";
import StatusCard from "./StatusCard";

import { useState } from "react";

interface Props {
    report: any,
    id: string
}

export default function ReportOverview({report, id}: Props) {
    const [deleted, setDeleted] = useState(false);

    const vatBreakdown = report.vat_breakdown as {
        sales: { rate: number; net: number; vat_amount: number; gross: number }[];
        purchases: { rate: number; net: number; vat_amount: number; gross: number }[];
    };

    const isRefund = Number(report.vat_payable) < 0;

    if (deleted) return (
        <StatusCard
            title="Report deleted"
            description="This report has been removed from your list."
            link={{ href: "/reports", label: "Back to reports", className: "bg-teal-600 hover:bg-teal-700" }}
            centered
        />
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Header report={report} id={id} setDeleted={setDeleted}/>
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
                <SummaryCards report={report} isRefund={isRefund}/>
                <SalesVatBreakdown vatBreakdown={vatBreakdown} report={report} />
                <PurchasesVatBreakdown vatBreakdown={vatBreakdown} report={report} />
                <VatReturned report={report}/>
            </div>
        </div>
    );
}