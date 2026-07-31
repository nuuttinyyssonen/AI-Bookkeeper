import { View, Text } from "react-native"
import { UseDashboardReturn } from "../../types/dashboard"

export default function Summary({ expenses, revenue, netProfit }: UseDashboardReturn) {
    return (
        <View className="gap-4">
            <View className="rounded-md border border-slate-200 bg-white p-5">
                <View className="h-1.5 w-12 rounded-full bg-teal-600" />
                <Text className="mt-4 text-sm text-slate-500">Liikevaihto</Text>
                <Text className="mt-2 text-2xl font-semibold text-slate-950">{(Number(revenue) ?? 0).toFixed(2)} €</Text>
            </View>
            <View className="rounded-md border border-slate-200 bg-white p-5">
                <View className="h-1.5 w-12 rounded-full bg-rose-500" />
                <Text className="mt-4 text-sm text-slate-500">Kulut</Text>
                <Text className="mt-2 text-2xl font-semibold text-slate-950">{(Number(expenses) ?? 0).toFixed(2)} €</Text>
            </View>
            <View className="rounded-md border border-slate-200 bg-white p-5">
                <View className="h-1.5 w-12 rounded-full bg-slate-900" />
                <Text className="mt-4 text-sm text-slate-500">Nettotulos</Text>
                <Text className="mt-2 text-2xl font-semibold text-slate-950">{(Number(netProfit) ?? 0).toFixed(2)} €</Text>
            </View>
        </View>
    ) 
};