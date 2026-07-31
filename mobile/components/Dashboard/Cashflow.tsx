import { View, Text } from "react-native"
import { UseDashboardReturn } from "../../types/dashboard"

export default function Cashflow({ cashflow, toPercent }: UseDashboardReturn) {
    return (
         <View className="rounded-md border border-slate-200 bg-white p-5">
            <Text className="text-lg font-semibold text-slate-950">Kassavirta</Text>
            <Text className="text-sm text-slate-500">Tulojen ja menojen kehitys</Text>

            <View className="mt-4 flex-row gap-4">
                <View className="flex-row items-center gap-2">
                    <View className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                    <Text className="text-sm text-slate-700">Tulot</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <View className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <Text className="text-sm text-slate-700">Menot</Text>
                </View>
            </View>

            <View className="mt-6 h-40 flex-row items-end justify-between border-b border-slate-200 pb-4">
                {cashflow.map((item: any) => (
                    <View key={item.month} className="flex-1 items-center justify-end gap-2 h-full">
                        <View className="flex-1 flex-row items-end justify-center gap-1">
                            <View className="w-2 rounded-t-md bg-teal-600" style={{ height: `${toPercent(item.income)}%` }} />
                            <View className="w-2 rounded-t-md bg-amber-500" style={{ height: `${toPercent(item.expense)}%` }} />
                        </View>
                        <Text className="text-xs font-medium text-slate-500">{item.month}</Text>
                    </View>
                ))}
            </View>
        </View>
    ) 
};