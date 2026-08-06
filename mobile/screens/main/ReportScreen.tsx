import { View, Text, ScrollView, TouchableOpacity } from "react-native";

const MOCK_REPORTS = [
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
                            const isRefund = report.vat_payable < 0;

                            return (
                                <View key={report.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <View className="flex-row items-start justify-between">
                                        <View>
                                            <Text className="text-base font-semibold text-slate-900">
                                                {new Date(report.period_start).toLocaleDateString("fi-FI")} –{" "}
                                                {new Date(report.period_end).toLocaleDateString("fi-FI")}
                                            </Text>
                                            <View className="mt-2 self-start rounded-full bg-slate-100 px-2.5 py-1">
                                                <Text className="text-xs font-medium text-slate-600">{report.period_type}</Text>
                                            </View>
                                        </View>
                                        <View className={`rounded-full px-2.5 py-1 ${report.vat_declaration_sent ? "bg-teal-50" : "bg-amber-50"}`}>
                                            <Text className={`text-xs font-medium ${report.vat_declaration_sent ? "text-teal-700" : "text-amber-700"}`}>
                                                {report.vat_declaration_sent ? "Lähetetty" : "Odottaa"}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="mt-4 flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-xs text-slate-400">Myynnin ALV</Text>
                                            <Text className="mt-0.5 text-sm font-medium text-teal-700">
                                                {report.sales_vat_amount.toFixed(2)} €
                                            </Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs text-slate-400">Ostojen ALV</Text>
                                            <Text className="mt-0.5 text-sm font-medium text-slate-700">
                                                {report.purchase_vat_amount.toFixed(2)} €
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-4">
                                        <View>
                                            <Text className="text-xs text-slate-400">{isRefund ? "Palautus" : "Maksettava"}</Text>
                                            <Text className={`text-base font-semibold ${isRefund ? "text-teal-600" : "text-rose-600"}`}>
                                                {Math.abs(report.vat_payable).toFixed(2)} €
                                            </Text>
                                        </View>
                                        <Text className="text-xs text-slate-500">
                                            Luotu {new Date(report.created_at).toLocaleDateString("fi-FI")}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => handleNavigateToReport(report.id)}
                                        className="mt-4 h-11 items-center justify-center rounded-lg bg-slate-950"
                                    >
                                        <Text className="text-sm font-semibold text-white">Näytä</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <View className="items-center rounded-xl border border-dashed border-slate-200 bg-white p-16">
                        <Text className="text-lg font-semibold text-slate-900">Ei vielä raportteja</Text>
                        <Text className="mt-2 text-center text-sm text-slate-500">
                            Luo ensimmäinen ALV-raporttisi valmistautuaksesi veroilmoitukseen.
                        </Text>
                        <TouchableOpacity className="mt-6 rounded-md bg-teal-600 px-4 py-2">
                            <Text className="text-sm font-semibold text-white">+ Uusi raportti</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};
