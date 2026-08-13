import { View, Text } from "react-native";
import { UseReportByIdReturn } from "../../types/report";

export default function VATSummaryCards({ report }: UseReportByIdReturn) {
    const isRefund = parseFloat(report.vat_payable) < 0;
    return (
        <View className="gap-4">
            <View className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
                <Text className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Myynnin ALV</Text>
                <Text className="mt-2 text-2xl font-semibold text-teal-600 dark:text-teal-300">{parseFloat(report.sales_vat_amount).toFixed(2)} €</Text>
                <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">Veroton {parseFloat(report.sales_net).toFixed(2)} €</Text>
            </View>
            <View className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
                <Text className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Ostojen ALV</Text>
                <Text className="mt-2 text-2xl font-semibold text-slate-700 dark:text-slate-200">{parseFloat(report.purchase_vat_amount).toFixed(2)} €</Text>
                <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">Veroton {parseFloat(report.purchase_net).toFixed(2)} €</Text>
            </View>
            <View className={`rounded-xl border p-5 shadow-sm ${isRefund ? "border-teal-200 bg-teal-50 dark:bg-teal-900" : "border-rose-200 dark:border-rose-700 bg-rose-50 dark:bg-rose-900"}`}>
                <Text className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {isRefund ? "ALV-palautus" : "Maksettava ALV"}
                </Text>
                <Text className={`mt-2 text-2xl font-semibold ${isRefund ? "text-teal-700 dark:text-teal-200" : "text-rose-600 dark:text-rose-300"}`}>
                    {Math.abs(parseFloat(report.vat_payable)).toFixed(2)} €
                </Text>
                <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {isRefund ? "Verohallinto palauttaa sinulle" : "Maksa Verohallinnolle"}
                </Text>
            </View>
        </View>
    );
};