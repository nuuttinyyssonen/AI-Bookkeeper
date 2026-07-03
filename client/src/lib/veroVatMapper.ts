// lib/veroVatMapper.ts

interface VatBreakdownItem {
    net: number;
    rate: number;
    gross: number;
    vat_amount: number;
}

interface VatBreakdown {
    sales: VatBreakdownItem[];
    purchases: VatBreakdownItem[];
}

const getHighRate = (items: VatBreakdownItem[]) =>
    items.filter(i => i.rate === 25.5 || i.rate === 24)
         .reduce((sum, i) => sum + i.vat_amount, 0);

const getMediumRate = (items: VatBreakdownItem[]) =>
    items.filter(i => i.rate === 14 || i.rate === 13.5)
         .reduce((sum, i) => sum + i.vat_amount, 0);

const getLowRate = (items: VatBreakdownItem[]) =>
    items.filter(i => i.rate === 10)
         .reduce((sum, i) => sum + i.vat_amount, 0);

export const mapVatReportToVeroRequest = (
    report: {
        vat_breakdown: VatBreakdown;
        period_end: Date;
        user: { business_id: string; first_name: string; last_name: string; phonenumber: string };
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