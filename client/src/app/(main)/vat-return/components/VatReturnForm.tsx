'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { mapVatReportToVeroRequest } from "@/lib/veroVatMapper";

interface VatFields {
    highVatRate: number;
    mediumVatRate: number;
    lowVatRate: number;
    deductibleVat: number;
    filingPeriod: string;
    fullName: string;
    phoneNumber: string;
}

interface Props {
    user: any;
    reports: any[];
}

export default function VatReturnForm({ user, reports }: Props) {
    const t = useTranslations('vatReturnForm');
    const router = useRouter();

    const [selectedReportId, setSelectedReportId] = useState("");
    const [fields, setFields] = useState<VatFields | null>(null);
    const [editing, setEditing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [filedReturn, setFiledReturn] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleReportSelect = (id: string) => {
        setSelectedReportId(id);
        setResult(null);
        setFiledReturn(null);
        const report = reports.find(r => r.id === id);
        if (!report) return;

        const mapped = mapVatReportToVeroRequest({ ...report, user });
        setFields({
            highVatRate: mapped.VATDetails.VATOnDomesticSalesByTaxRate.HighVATRate,
            mediumVatRate: mapped.VATDetails.VATOnDomesticSalesByTaxRate.MediumVATRate,
            lowVatRate: mapped.VATDetails.VATOnDomesticSalesByTaxRate.LowVATRate,
            deductibleVat: mapped.VATDetails.DeductibleVAT,
            filingPeriod: mapped.FilingPeriod,
            fullName: mapped.ContactDetails.FullName,
            phoneNumber: mapped.ContactDetails.PhoneNumber,
        });
        setEditing(false);
    };

    const handleSubmit = async () => {
        if (!fields) return;
        setLoading(true);

        const body = {
            reportId: selectedReportId,
            ReplacementReturn: false,
            BusinessId: user.business_id,
            FilingPeriod: fields.filingPeriod,
            NoActivity: false,
            VATDetails: {
                VATOnDomesticSalesByTaxRate: {
                    HighVATRate: fields.highVatRate,
                    MediumVATRate: fields.mediumVatRate,
                    LowVATRate: fields.lowVatRate,
                },
                DeductibleVAT: fields.deductibleVat,
            },
            ContactDetails: {
                FullName: fields.fullName,
                PhoneNumber: fields.phoneNumber,
            },
        };

        const res = await fetch("/api/vero/file-return", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.status === 403) {
            router.push("/pricing?message=subscription_required");
            return;
        }

        const data = await res.json();
        setResult(data);
        setLoading(false);
        setEditing(false);
    };

    const handleGetReturn = async () => {
        const res = await fetch("/api/vero/get-return", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                BusinessId: user.business_id,
                FilingPeriod: fields?.filingPeriod,
            }),
        });

        if (res.status === 403) {
            router.push("/pricing?message=subscription_required");
            return;
        }

        const data = await res.json();
        setFiledReturn(data);
    };

    const DisplayRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500 w-48">{label}</span>
            <span className="text-sm font-medium text-slate-800">{value ?? "—"}</span>
        </div>
    );

    const EditRow = ({ label, fieldKey, value }: { label: string; fieldKey: keyof VatFields; value: string | number }) => (
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500 w-48">{label}</span>
            {editing ? (
                <input
                    type={typeof value === "number" ? "number" : "text"}
                    value={fields![fieldKey] as string | number}
                    onChange={(e) => setFields(f => ({
                        ...f!,
                        [fieldKey]: typeof value === "number" ? Number(e.target.value) : e.target.value
                    }))}
                    className="w-48 h-8 rounded-md border border-slate-200 px-3 text-sm text-right"
                />
            ) : (
                <span className="text-sm font-medium text-slate-800">{value}</span>
            )}
        </div>
    );

    return (
        <div className="max-w-xl bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-medium">{t('title')}</h2>

            <select
                className="w-full h-9 rounded-md border border-slate-200 px-3 text-sm text-slate-700"
                value={selectedReportId}
                onChange={(e) => handleReportSelect(e.target.value)}
            >
                <option value="">{t('selectReport')}</option>
                {reports.map(r => (
                    <option key={r.id} value={r.id}>
                        {r.period_type} — {new Date(r.period_start).toLocaleDateString("fi-FI")} – {new Date(r.period_end).toLocaleDateString("fi-FI")}
                    </option>
                ))}
            </select>

            {fields && (
                <>
                    <div>
                        <EditRow label={t('filingPeriod')} fieldKey="filingPeriod" value={fields.filingPeriod} />
                        <EditRow label={t('vatHigh')} fieldKey="highVatRate" value={fields.highVatRate} />
                        <EditRow label={t('vatMedium')} fieldKey="mediumVatRate" value={fields.mediumVatRate} />
                        <EditRow label={t('vatLow')} fieldKey="lowVatRate" value={fields.lowVatRate} />
                        <EditRow label={t('deductibleVat')} fieldKey="deductibleVat" value={fields.deductibleVat} />
                        <EditRow label={t('contactName')} fieldKey="fullName" value={fields.fullName} />
                        <EditRow label={t('phoneNumber')} fieldKey="phoneNumber" value={fields.phoneNumber} />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditing(e => !e)}
                            className="h-9 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                        >
                            {editing ? t('cancel') : t('edit')}
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="h-9 px-4 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50"
                        >
                            {loading ? t('sending') : t('submit')}
                        </button>
                    </div>

                    {result?.UniqueIdentifier && (
                        <div className="text-sm p-4 rounded-lg bg-green-50 border border-green-200">
                            <p className="text-green-700 font-medium">{t('filedSuccess')}</p>
                            <p className="text-slate-600 mt-1">{t('id', { id: result.UniqueIdentifier })}</p>
                            <p className="text-slate-600">{t('timestamp', { timestamp: result.AcceptedTimestamp })}</p>
                            <button
                                onClick={handleGetReturn}
                                className="mt-3 h-8 px-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                            >
                                {t('viewFiled')}
                            </button>
                        </div>
                    )}

                    {result?.ErrorText && (
                        <div className="text-sm p-4 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-red-600">{result.ErrorText}</p>
                        </div>
                    )}

                    {filedReturn && (
                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-sm font-medium text-slate-700 mb-2">{t('filedDetails')}</p>
                            <DisplayRow label={t('status')} value={filedReturn.Status} />
                            <DisplayRow label={t('submitted')} value={filedReturn.SubmittedDate} />
                            <DisplayRow label={t('vatHigh')} value={filedReturn.VATOnDomesticSales?.HighVATRate} />
                            <DisplayRow label={t('vatMedium')} value={filedReturn.VATOnDomesticSales?.MediumVATRate} />
                            <DisplayRow label={t('vatLow')} value={filedReturn.VATOnDomesticSales?.LowVATRate} />
                            <DisplayRow label={t('deductibleVat')} value={filedReturn.DeductibleTax?.DeductibleVAT} />
                            <DisplayRow label={t('taxPayable')} value={filedReturn.TaxPayableOrNegativeTaxThatQualifiesForRefund} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}