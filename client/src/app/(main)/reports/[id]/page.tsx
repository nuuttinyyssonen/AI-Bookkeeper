import { authenticateUser } from "@/lib/auth";
import { getReportById } from "./action";
import { notFound } from "next/navigation";

import ReportOverview from "./components/ReportOverview";

export default async function ReportPage({ params }: { params: { id: string } }) {
    await authenticateUser();
    const { id } = await params;
    const report = await getReportById(id);

    if (!report) return notFound();

    return (
        <div>
            <ReportOverview report={report} id={id} />
        </div>
    );
};