import ReportEmpty from "./ReportEmpty";
import ReportTableHead from "./ReportTableHead";
import ReportRow from "./ReportRow";
import ReportCard from "./ReportCard";
import { VatReport } from "@/app/types/report";

interface Props {
    reports: VatReport[]
};

export default function Reports({reports}: Props) {
    return (
        <div className="px-4 py-6 sm:px-6 lg:px-8">
            {reports && reports.length > 0 ? (
                <>
                    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
                        <table className="w-full text-sm">
                            <ReportTableHead />
                            <tbody className="divide-y divide-slate-100">
                                {reports.map((report) => (
                                    <ReportRow key={report.id} report={report} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col gap-3 md:hidden">
                        {reports.map((report) => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </div>
                </>
            ) : (
                <ReportEmpty />
            )}
        </div>
    );
};