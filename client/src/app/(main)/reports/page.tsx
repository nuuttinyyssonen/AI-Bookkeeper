import { authenticateUser } from "@/lib/auth";
import { getReports } from "./action";

import Reports from "./components/Reports";
import Header from "./components/Header";

export default async function ReportsPage() {
    await authenticateUser();
    const reports = await getReports();

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <Reports reports={reports}/>
        </div>
    );
}