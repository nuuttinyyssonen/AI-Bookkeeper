import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import ReportCard from "../../components/Report/ReportCard";
import NoReport from "../../components/Report/NoReport";
import { Report } from "../../types/report";

const MOCK_REPORTS: Report[] = [
    {
        id: "1",
        period_start: "2026-01-01",
        period_end: "2026-01-31",
        period_type: "MONTHLY",
        sales_vat_amount: 1240.50,
        purchase_vat_amount: 380.20,
        vat_payable: 860.30,
        vat_declaration_sent: true,
        created_at: "2026-02-03",
    },
    {
        id: "2",
        period_start: "2025-10-01",
        period_end: "2025-12-31",
        period_type: "Q4",
        sales_vat_amount: 3120.00,
        purchase_vat_amount: 1890.75,
        vat_payable: 1229.25,
        vat_declaration_sent: true,
        created_at: "2026-01-05",
    },
    {
        id: "3",
        period_start: "2025-07-01",
        period_end: "2025-09-30",
        period_type: "Q3",
        sales_vat_amount: 640.00,
        purchase_vat_amount: 910.40,
        vat_payable: -270.40,
        vat_declaration_sent: false,
        created_at: "2025-10-04",
    },
    {
        id: "4",
        period_start: "2025-01-01",
        period_end: "2025-12-31",
        period_type: "YEARLY",
        sales_vat_amount: 14820.00,
        purchase_vat_amount: 6410.55,
        vat_payable: 8409.45,
        vat_declaration_sent: false,
        created_at: "2026-01-15",
    },
];



export default function ReportScreen({ navigation }: any) {
    const handleNavigateToReport = (id: string) => {
        navigation.navigate("ReportView", { id });
    };

    return (
        <ScrollView className="flex-1 bg-slate-50">
            <View className="border-b border-slate-200 bg-white px-4 py-4">
                <Text className="text-2xl font-semibold text-slate-950">Raportit</Text>
                <Text className="mt-1 text-sm text-slate-500">ALV-raporttisi veroilmoitusta varten.</Text>
            </View>

            <View className="px-4 py-6">
                {MOCK_REPORTS.length > 0 ? (
                    <View className="gap-4">
                        {MOCK_REPORTS.map((report) => {
                            return (
                                <ReportCard key={report.id} {...report} handleNavigateToReport={handleNavigateToReport}/>
                            );
                        })}
                    </View>
                ) : (
                    <NoReport />
                )}
            </View>
        </ScrollView>
    );
};
