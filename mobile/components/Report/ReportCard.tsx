import { View, Text, TouchableOpacity } from "react-native"
import { Report } from "../../types/report"

export default function ReportCard({ id, period_end, period_start, 
    period_type, vat_declaration_sent, sales_vat_amount, 
    vat_payable, created_at, handleNavigateToReport 
}: Report & { handleNavigateToReport: (id: string) => void }) {
    const isRefund = parseFloat(vat_payable) < 0;

    return (
        <View className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
            <View className="flex-row items-start justify-between">
                <View>
                    <Text className="text-base font-semibold text-slate-900 dark:text-slate-50">
                        {new Date(period_start).toLocaleDateString("fi-FI")} –{" "}
                        {new Date(period_end).toLocaleDateString("fi-FI")}
                    </Text>
                    <View className="mt-2 self-start rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1">
                        <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">{period_type}</Text>
                    </View>
                </View>
                <View className={`rounded-full px-2.5 py-1 ${vat_declaration_sent ? "bg-teal-50 dark:bg-teal-900" : "bg-amber-50 dark:bg-amber-900"}`}>
                    <Text className={`text-xs font-medium ${vat_declaration_sent ? "text-teal-700 dark:text-teal-200" : "text-amber-700 dark:text-amber-200"}`}>
                        {vat_declaration_sent ? "Lähetetty" : "Odottaa"}
                    </Text>
                </View>
            </View>

            <View className="mt-4 flex-row gap-4">
                <View className="flex-1">
                    <Text className="text-xs text-slate-400 dark:text-slate-500">Myynnin ALV</Text>
                    <Text className="mt-0.5 text-sm font-medium text-teal-700 dark:text-teal-200">
                        {parseFloat(sales_vat_amount).toFixed(2)} € €
                    </Text>
                </View>
                <View className="flex-1">
                    <Text className="text-xs text-slate-400 dark:text-slate-500">Ostojen ALV</Text>
                    <Text className="mt-0.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {parseFloat(sales_vat_amount).toFixed(2)} € €
                    </Text>
                </View>
            </View>

            <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                <View>
                    <Text className="text-xs text-slate-400 dark:text-slate-500">{isRefund ? "Palautus" : "Maksettava"}</Text>
                    <Text className={`text-base font-semibold ${isRefund ? "text-teal-600 dark:text-teal-300" : "text-rose-600 dark:text-rose-300"}`}>
                        {Math.abs(parseFloat(vat_payable)).toFixed(2)} € €
                    </Text>
                </View>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                    Luotu {new Date(created_at).toLocaleDateString("fi-FI")}
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => handleNavigateToReport(id)}
                className="mt-4 h-11 items-center justify-center rounded-lg bg-slate-950 dark:bg-slate-800"
            >
                <Text className="text-sm font-semibold text-white">Näytä</Text>
            </TouchableOpacity>
        </View>
    );
};