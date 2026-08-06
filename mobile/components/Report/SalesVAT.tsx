import { View, Text } from "react-native"
import { Report, VatBreakdownRow } from "../../types/report"

export default function SalesVAT({ vat_breakdown, sales_net, sales_vat_amount, sales_gross }: Report) {
    return (
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
            {vat_breakdown.sales.map((row: VatBreakdownRow) => (
                <View key={row.rate} className="flex-row border-b border-slate-100 px-5 py-3">
                    <Text className="flex-1 text-sm font-medium text-slate-900">{row.rate}%</Text>
                    <Text className="flex-1 text-right text-sm text-slate-600">{row.net.toFixed(2)} €</Text>
                    <Text className="flex-1 text-right text-sm font-medium text-teal-700">{row.vat_amount.toFixed(2)} €</Text>
                    <Text className="flex-1 text-right text-sm text-slate-600">{row.gross.toFixed(2)} €</Text>
                </View>
            ))}
            <View className="flex-row bg-slate-50 px-5 py-3">
                <Text className="flex-1 text-sm font-semibold text-slate-900">Yhteensä</Text>
                <Text className="flex-1 text-right text-sm font-semibold text-slate-900">{sales_net.toFixed(2)} €</Text>
                <Text className="flex-1 text-right text-sm font-semibold text-teal-700">{sales_vat_amount.toFixed(2)} €</Text>
                <Text className="flex-1 text-right text-sm font-semibold text-slate-900">{sales_gross.toFixed(2)} €</Text>
            </View>
        </View>
    );
};