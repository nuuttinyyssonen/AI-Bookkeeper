import { View, Text, ScrollView, TouchableOpacity } from "react-native";

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

export default function ReportViewScreen({ navigation }: any) {
    const report = MOCK_REPORT;
    const isRefund = report.vat_payable < 0;

    return (
        <ScrollView className="flex-1 bg-slate-50">
            <View className="border-b border-slate-200 bg-white px-4 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text className="text-sm text-slate-500">← Takaisin raportteihin</Text>
                </TouchableOpacity>

                <View className="mt-1 flex-row items-start justify-between">
                    <View className="flex-1 pr-3">
                        <Text className="text-2xl font-semibold tracking-tight text-slate-950">
                            ALV-raportti – {report.period_type}
                        </Text>
                        <Text className="mt-1 text-sm text-slate-500">
                            {new Date(report.period_start).toLocaleDateString("fi-FI")} –{" "}
                            {new Date(report.period_end).toLocaleDateString("fi-FI")}
                        </Text>
                    </View>
                    <View className={`rounded-full px-3 py-1 ${report.vat_declaration_sent ? "bg-teal-50" : "bg-amber-50"}`}>
                        <Text className={`text-xs font-medium ${report.vat_declaration_sent ? "text-teal-700" : "text-amber-700"}`}>
                            {report.vat_declaration_sent ? "Lähetetty" : "Odottaa"}
                        </Text>
                    </View>
                </View>

                <View className="mt-4 flex-row gap-2">
                    <TouchableOpacity className="rounded-md bg-red-100 px-4 py-2">
                        <Text className="text-sm font-semibold text-red-700">Poista</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="rounded-md bg-teal-600 px-4 py-2">
                        <Text className="text-sm font-semibold text-white">Lataa PDF</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="gap-6 px-4 py-6">
                <View className="gap-4">
                    <View className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">Myynnin ALV</Text>
                        <Text className="mt-2 text-2xl font-semibold text-teal-600">{report.sales_vat_amount.toFixed(2)} €</Text>
                        <Text className="mt-1 text-xs text-slate-500">Veroton {report.sales_net.toFixed(2)} €</Text>
                    </View>
                    <View className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">Ostojen ALV</Text>
                        <Text className="mt-2 text-2xl font-semibold text-slate-700">{report.purchase_vat_amount.toFixed(2)} €</Text>
                        <Text className="mt-1 text-xs text-slate-500">Veroton {report.purchase_net.toFixed(2)} €</Text>
                    </View>
                    <View className={`rounded-xl border p-5 shadow-sm ${isRefund ? "border-teal-200 bg-teal-50" : "border-rose-200 bg-rose-50"}`}>
                        <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            {isRefund ? "ALV-palautus" : "Maksettava ALV"}
                        </Text>
                        <Text className={`mt-2 text-2xl font-semibold ${isRefund ? "text-teal-700" : "text-rose-600"}`}>
                            {Math.abs(report.vat_payable).toFixed(2)} €
                        </Text>
                        <Text className="mt-1 text-xs text-slate-500">
                            {isRefund ? "Verohallinto palauttaa sinulle" : "Maksa Verohallinnolle"}
                        </Text>
                    </View>
                </View>

                <View className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <View className="border-b border-slate-100 px-5 py-4">
                        <Text className="font-semibold text-slate-900">Myynnin ALV-erittely</Text>
                        <Text className="mt-0.5 text-xs text-slate-500">Asiakkailtasi kerätty ALV</Text>
                    </View>
                    <View className="flex-row border-b border-slate-100 bg-slate-50 px-5 py-3">
                        <Text className="flex-1 text-xs font-medium text-slate-500">ALV-kanta</Text>
                        <Text className="flex-1 text-right text-xs font-medium text-slate-500">Veroton</Text>
                        <Text className="flex-1 text-right text-xs font-medium text-slate-500">ALV</Text>
                        <Text className="flex-1 text-right text-xs font-medium text-slate-500">Verollinen</Text>
                    </View>
                    {report.vat_breakdown.sales.map((row) => (
                        <View key={row.rate} className="flex-row border-b border-slate-100 px-5 py-3">
                            <Text className="flex-1 text-sm font-medium text-slate-900">{row.rate}%</Text>
                            <Text className="flex-1 text-right text-sm text-slate-600">{row.net.toFixed(2)} €</Text>
                            <Text className="flex-1 text-right text-sm font-medium text-teal-700">{row.vat_amount.toFixed(2)} €</Text>
                            <Text className="flex-1 text-right text-sm text-slate-600">{row.gross.toFixed(2)} €</Text>
                        </View>
                    ))}
                    <View className="flex-row bg-slate-50 px-5 py-3">
                        <Text className="flex-1 text-sm font-semibold text-slate-900">Yhteensä</Text>
                        <Text className="flex-1 text-right text-sm font-semibold text-slate-900">{report.sales_net.toFixed(2)} €</Text>
                        <Text className="flex-1 text-right text-sm font-semibold text-teal-700">{report.sales_vat_amount.toFixed(2)} €</Text>
                        <Text className="flex-1 text-right text-sm font-semibold text-slate-900">{report.sales_gross.toFixed(2)} €</Text>
                    </View>
                </View>

                <View className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <View className="border-b border-slate-100 px-5 py-4">
                        <Text className="font-semibold text-slate-900">Ostojen ALV-erittely</Text>
                        <Text className="mt-0.5 text-xs text-slate-500">Ostoistasi vähennyskelpoinen ALV</Text>
                    </View>
                    <View className="flex-row border-b border-slate-100 bg-slate-50 px-5 py-3">
                        <Text className="flex-1 text-xs font-medium text-slate-500">ALV-kanta</Text>
                        <Text className="flex-1 text-right text-xs font-medium text-slate-500">Veroton</Text>
                        <Text className="flex-1 text-right text-xs font-medium text-slate-500">ALV</Text>
                        <Text className="flex-1 text-right text-xs font-medium text-slate-500">Verollinen</Text>
                    </View>
                    {report.vat_breakdown.purchases.map((row) => (
                        <View key={row.rate} className="flex-row border-b border-slate-100 px-5 py-3">
                            <Text className="flex-1 text-sm font-medium text-slate-900">{row.rate}%</Text>
                            <Text className="flex-1 text-right text-sm text-slate-600">{row.net.toFixed(2)} €</Text>
                            <Text className="flex-1 text-right text-sm font-medium text-slate-700">{row.vat_amount.toFixed(2)} €</Text>
                            <Text className="flex-1 text-right text-sm text-slate-600">{row.gross.toFixed(2)} €</Text>
                        </View>
                    ))}
                    <View className="flex-row bg-slate-50 px-5 py-3">
                        <Text className="flex-1 text-sm font-semibold text-slate-900">Yhteensä</Text>
                        <Text className="flex-1 text-right text-sm font-semibold text-slate-900">{report.purchase_net.toFixed(2)} €</Text>
                        <Text className="flex-1 text-right text-sm font-semibold text-slate-700">{report.purchase_vat_amount.toFixed(2)} €</Text>
                        <Text className="flex-1 text-right text-sm font-semibold text-slate-900">{report.purchase_gross.toFixed(2)} €</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <View className="flex-1 pr-3">
                        <Text className="font-medium text-slate-900">ALV-ilmoitus lähetetty</Text>
                        <Text className="mt-0.5 text-sm text-slate-500">Merkitse tämä raportti lähetetyksi Verohallinnolle</Text>
                    </View>
                    <TouchableOpacity className={`rounded-lg px-4 py-2 ${report.vat_declaration_sent ? "bg-teal-600" : "border border-slate-200"}`}>
                        <Text className={`text-sm font-semibold ${report.vat_declaration_sent ? "text-white" : "text-slate-700"}`}>
                            {report.vat_declaration_sent ? "Lähetetty ✓" : "Ei lähetetty"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};
