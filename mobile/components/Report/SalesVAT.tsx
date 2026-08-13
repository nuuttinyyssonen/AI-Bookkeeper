import { View, Text } from "react-native"
import { Report, VatBreakdownRow } from "../../types/report"
import { UseReportByIdReturn } from "../../types/report";

export default function SalesVAT({ report }: UseReportByIdReturn) {
    return (
        <View className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-sm">
            <View className="border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                <Text className="font-semibold text-slate-900 dark:text-slate-50">Myynnin ALV-erittely</Text>
                <Text className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Asiakkailtasi kerätty ALV</Text>
            </View>
            <View className="flex-row border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-5 py-3">
                <Text className="flex-1 text-xs font-medium text-slate-500 dark:text-slate-400">ALV-kanta</Text>
                <Text className="flex-1 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Veroton</Text>
                <Text className="flex-1 text-right text-xs font-medium text-slate-500 dark:text-slate-400">ALV</Text>
                <Text className="flex-1 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Verollinen</Text>
            </View>
            {report.vat_breakdown.sales.map((row: VatBreakdownRow) => (
                <View key={row.rate} className="flex-row border-b border-slate-100 dark:border-slate-800 px-5 py-3">
                    <Text className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-50">{row.rate}%</Text>
                    <Text className="flex-1 text-right text-sm text-slate-600 dark:text-slate-300">{row.net.toFixed(2)} €</Text>
                    <Text className="flex-1 text-right text-sm font-medium text-teal-700 dark:text-teal-200">{row.vat_amount.toFixed(2)} €</Text>
                    <Text className="flex-1 text-right text-sm text-slate-600 dark:text-slate-300">{row.gross.toFixed(2)} €</Text>
                </View>
            ))}
            <View className="flex-row bg-slate-50 dark:bg-slate-900 px-5 py-3">
                <Text className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-50">Yhteensä</Text>
                <Text className="flex-1 text-right text-sm font-semibold text-slate-900 dark:text-slate-50">{parseFloat(report.sales_net).toFixed(2)} €</Text>
                <Text className="flex-1 text-right text-sm font-semibold text-teal-700 dark:text-teal-200">{parseFloat(report.sales_vat_amount).toFixed(2)} €</Text>
                <Text className="flex-1 text-right text-sm font-semibold text-slate-900 dark:text-slate-50">{parseFloat(report.sales_gross).toFixed(2)} €</Text>
            </View>
        </View>
    );
};