'use client';

import Reports from "./Reports";
import Header from "./Header";
import { useState } from "react";

interface Props {
    initalReports: any
}

export default function ReportsProvider({initalReports}: Props) {
    const [reports, setReports] = useState(initalReports);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header reports={reports} setReports={setReports}/>
            <Reports reports={reports}/>
        </div>
    );
}