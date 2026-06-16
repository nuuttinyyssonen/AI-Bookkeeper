import ReportsProvider from "./components/ReportsProvider";
import { authenticateUser } from "@/lib/auth";
import { getReports } from "./action";

export default async function ReportsPage() {
    await authenticateUser();
    const reports = await getReports();

    return (
        <div className="min-h-screen bg-slate-50">
            <ReportsProvider initalReports={reports} />
        </div>
    );
}