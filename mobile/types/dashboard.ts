type CashflowItem = {
    income: number | string;
    expense: number | string;
    month: string;
};

type RecentReceipt = {
    id: string;
    vendor_name: string;
    total_amount: number | string;
    receipt_date: string;
    receipt_type: "EXPENSE" | "INCOME";
};

export type UseDashboardReturn = {
    handleLogout: () => Promise<void>;
    subscriptionType: string;
    revenue: string;
    expenses: string;
    netProfit: string;
    cashflow: CashflowItem[];
    toPercent: (value: number) => number;
    recentReceipts: RecentReceipt[];
};