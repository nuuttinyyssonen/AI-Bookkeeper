import ReportEmpty from "./ReportEmpty";
import ReportTableHead from "./ReportTableHead";
import ReportRow from "./ReportRow";

interface Props {
    reports: any
};

export default function Reports({reports}: Props) {
    return (
        <div className="px-4 py-6 sm:px-6 lg:px-8">
            {reports && reports.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <ReportTableHead />
                        <tbody className="divide-y divide-slate-100">
                            {reports.map((report: any) => (
                                <ReportRow key={report.id} report={report} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <ReportEmpty />
            )}
        </div>
    );
};