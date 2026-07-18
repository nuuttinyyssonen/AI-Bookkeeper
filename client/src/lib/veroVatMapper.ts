// lib/veroVatMapper.ts

import { VatBreakdown, VatBreakdownRow } from "@/app/types/report";
import { User } from "@/app/types/user";

const getHighRate = (items: VatBreakdownRow[]) =>
    items.filter(i => i.rate === 25.5 || i.rate === 24)
         .reduce((sum, i) => sum + i.vat_amount, 0);

const getMediumRate = (items: VatBreakdownRow[]) =>
    items.filter(i => i.rate === 14 || i.rate === 13.5)
         .reduce((sum, i) => sum + i.vat_amount, 0);

const getLowRate = (items: VatBreakdownRow[]) =>
    items.filter(i => i.rate === 10)
         .reduce((sum, i) => sum + i.vat_amount, 0);

export const mapVatReportToVeroRequest = (
    report: {
        vat_breakdown: VatBreakdown;
        period_end: Date | string;
        user: Pick<User, "business_id" | "first_name" | "last_name" | "phonenumber">;
    }
) => {
    const { sales, purchases } = report.vat_breakdown;

    return {
        ReplacementReturn: false,
        BusinessId: report.user.business_id,
        FilingPeriod: new Date(report.period_end).toISOString().split("T")[0],
        NoActivity: sales.length === 0 && purchases.length === 0,
        VATDetails: {
            VATOnDomesticSalesByTaxRate: {
                HighVATRate: Number(getHighRate(sales).toFixed(2)),
                MediumVATRate: Number(getMediumRate(sales).toFixed(2)),
                LowVATRate: Number(getLowRate(sales).toFixed(2)),
            },
            DeductibleVAT: Number(purchases.reduce((sum, i) => sum + i.vat_amount, 0).toFixed(2)),
        },
        ContactDetails: {
            FullName: `${report.user.first_name} ${report.user.last_name}`,
            PhoneNumber: report.user.phonenumber,
        },
    };
};