import { View, Text } from "react-native"
import { UseDashboardReturn } from "../../types/dashboard"

export default function RecentReceipts({ recentReceipts }: UseDashboardReturn) {
    return (
       <View className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950">
            <View className="border-b border-slate-200 dark:border-slate-700 p-5">
                <Text className="text-lg font-semibold text-slate-950 dark:text-slate-50">Viimeisimmät tapahtumat</Text>
            </View>
            <View>
                {recentReceipts.map((tx: any, index: any) => (
                    <View
                        key={index}
                        className={`flex-row items-center justify-between p-5 ${index !== recentReceipts.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}
                    >
                        <View>
                            <Text className="font-medium text-slate-950 dark:text-slate-50">{tx.vendor_name}</Text>
                            <Text className="text-sm text-slate-500 dark:text-slate-400">{new Date(tx.receipt_date).toLocaleDateString("fi-FI")}</Text>
                        </View>
                        <Text className="font-semibold text-slate-700 dark:text-slate-200">{tx.total_amount} €</Text>
                    </View>
                ))}
            </View>
        </View>
    ) 
};