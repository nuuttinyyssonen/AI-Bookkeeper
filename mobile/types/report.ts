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
    sales_vat_amount: string;
    purchase_vat_amount: string;
    vat_payable: string;
    created_at: string;
    sales_net: string;
    purchase_net: string;
    sales_gross: string;
    purchase_gross: string;
    vat_breakdown: VatBreakdown;
    pdf_path: string | null;
};

export type UseReportReturn = {
    reports: Report[];
    handleCreateReport: (timePeriod: string) => void;
    isLoading: boolean;
};

export type UseReportByIdReturn = {
    report: Report;
    isLoading: boolean;
    handleDeleteReport: () => void;
    handleUpdateReport: () => void;
};