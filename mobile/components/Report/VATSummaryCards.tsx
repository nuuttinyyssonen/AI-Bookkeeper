import { View, Text } from "react-native"
import { Report } from "../../types/report"

export default function VATSummaryCards({ sales_vat_amount, sales_net, purchase_vat_amount, 
purchase_net, vat_payable 
}: Report) {
    const isRefund = vat_payable < 0;
    return (
        <View className="gap-4">
            <View className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">Myynnin ALV</Text>
                <Text className="mt-2 text-2xl font-semibold text-teal-600">{sales_vat_amount.toFixed(2)} €</Text>
                <Text className="mt-1 text-xs text-slate-500">Veroton {sales_net.toFixed(2)} €</Text>
            </View>
            <View className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">Ostojen ALV</Text>
                <Text className="mt-2 text-2xl font-semibold text-slate-700">{purchase_vat_amount.toFixed(2)} €</Text>
                <Text className="mt-1 text-xs text-slate-500">Veroton {purchase_net.toFixed(2)} €</Text>
            </View>
            <View className={`rounded-xl border p-5 shadow-sm ${isRefund ? "border-teal-200 bg-teal-50" : "border-rose-200 bg-rose-50"}`}>
                <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {isRefund ? "ALV-palautus" : "Maksettava ALV"}
                </Text>
                <Text className={`mt-2 text-2xl font-semibold ${isRefund ? "text-teal-700" : "text-rose-600"}`}>
                    {Math.abs(vat_payable).toFixed(2)} €
                </Text>
                <Text className="mt-1 text-xs text-slate-500">
                    {isRefund ? "Verohallinto palauttaa sinulle" : "Maksa Verohallinnolle"}
                </Text>
            </View>
        </View>
    )
}