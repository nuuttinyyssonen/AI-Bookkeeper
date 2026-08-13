import { View, Text } from "react-native"
import { UseDashboardReturn } from "../../types/dashboard"

export default function Summary({ expenses, revenue, netProfit }: UseDashboardReturn) {
    return (
        <View className="gap-4">
            <View className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5">
                <View className="h-1.5 w-12 rounded-full bg-teal-600" />
                <Text className="mt-4 text-sm text-slate-500 dark:text-slate-400">Liikevaihto</Text>
                <Text className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">{(Number(revenue) ?? 0).toFixed(2)} €</Text>
            </View>
            <View className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5">
                <View className="h-1.5 w-12 rounded-full bg-rose-500 dark:bg-rose-400" />
                <Text className="mt-4 text-sm text-slate-500 dark:text-slate-400">Kulut</Text>
                <Text className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">{(Number(expenses) ?? 0).toFixed(2)} €</Text>
            </View>
            <View className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5">
                <View className="h-1.5 w-12 rounded-full bg-slate-900 dark:bg-slate-800" />
                <Text className="mt-4 text-sm text-slate-500 dark:text-slate-400">Nettotulos</Text>
                <Text className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">{(Number(netProfit) ?? 0).toFixed(2)} €</Text>
            </View>
        </View>
    ) 
};