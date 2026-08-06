import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import ReportViewHeader from "../../components/Report/ReportViewHeader";
import VATSummaryCards from "../../components/Report/VATSummaryCards";
import SalesVAT from "../../components/Report/SalesVAT";
import PurchasesVAT from "../../components/Report/PurchasesVAT";
import ReportViewFooter from "../../components/Report/ReportViewFooter";

const MOCK_REPORT = {
    id: "1",
    period_start: "2026-01-01",
    period_end: "2026-01-31",
    period_type: "MONTHLY",
    sales_net: 5620.00,
    sales_vat_amount: 1240.50,
    sales_gross: 6860.50,
    purchase_net: 1580.00,
    purchase_vat_amount: 380.20,
    purchase_gross: 1960.20,
    vat_payable: 860.30,
    vat_declaration_sent: true,
    created_at: "2026-02-03",
    vat_breakdown: {
        sales: [
            { rate: 25.5, net: 4200.00, vat_amount: 1071.00, gross: 5271.00 },
            { rate: 14, net: 1000.00, vat_amount: 140.00, gross: 1140.00 },
            { rate: 10, net: 420.00, vat_amount: 29.50, gross: 449.50 },
        ],
        purchases: [
            { rate: 25.5, net: 1200.00, vat_amount: 306.00, gross: 1506.00 },
            { rate: 14, net: 380.00, vat_amount: 74.20, gross: 454.20 },
        ],
    },
};

export default function ReportViewScreen() {
    const report = MOCK_REPORT;
    return (
        <ScrollView className="flex-1 bg-slate-50">
            <ReportViewHeader {...report}/>
            <View className="gap-6 px-4 py-6">
                <VATSummaryCards {...report}/>
                <SalesVAT {...report}/>
                <PurchasesVAT {...report}/>
                <ReportViewFooter {...report}/>
            </View>
        </ScrollView>
    );
};
