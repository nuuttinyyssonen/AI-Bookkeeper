export type VatBreakdownRow = {
    rate: number;
    net: number;
    vat_amount: number;
    gross: number;
};

type VatBreakdown = {
    sales: VatBreakdownRow[];
    purchases: VatBreakdownRow[];
};

export type Report = {
    id: string;
    period_start: string;
    period_end: string;
    period_type: string;
    vat_declaration_sent: boolean;
    sales_vat_amount: number;
    purchase_vat_amount: number;
    vat_payable: number;
    created_at: string;
    sales_net: number;
    purchase_net: number;
    vat_breakdown: VatBreakdown;
    sales_gross: number;
    purchase_gross: number
};