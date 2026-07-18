export type VatReportPeriod = "MONTHLY" | "YEARLY" | "Q1" | "Q2" | "Q3" | "Q4";

export type VatBreakdownRow = {
    rate: number;
    net: number;
    vat_amount: number;
    gross: number;
};

export type VatBreakdown = {
    sales: VatBreakdownRow[];
    purchases: VatBreakdownRow[];
};

export type VatReport = {
    id: string;
    user_id: string;
    period_start: string;
    period_end: string;
    period_type: VatReportPeriod;
    sales_net: number | string;
    sales_vat_amount: number | string;
    sales_gross: number | string;
    purchase_net: number | string;
    purchase_vat_amount: number | string;
    purchase_gross: number | string;
    vat_payable: number | string;
    vat_breakdown: VatBreakdown;
    vat_declaration_sent: boolean;
    pdf_path?: string | null;
    created_at: string;
};
