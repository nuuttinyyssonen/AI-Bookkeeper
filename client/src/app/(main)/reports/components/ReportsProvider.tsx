'use client';

import Reports from "./Reports";
import Header from "./Header";
import { useState } from "react";
import { VatReport } from "@/app/types/report";

interface Props {
    initalReports: VatReport[]
}

export default function ReportsProvider({initalReports}: Props) {
    const [reports, setReports] = useState<VatReport[]>(initalReports);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header reports={reports} setReports={setReports}/>
            <Reports reports={reports}/>
        </div>
    );
}