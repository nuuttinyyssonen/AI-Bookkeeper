import { View, Text } from "react-native"
import { UseDashboardReturn } from "../../types/dashboard"

export default function RecentReceipts({ recentReceipts }: UseDashboardReturn) {
    return (
       <View className="rounded-md border border-slate-200 bg-white">
            <View className="border-b border-slate-200 p-5">
                <Text className="text-lg font-semibold text-slate-950">Viimeisimmät tapahtumat</Text>
            </View>
            <View>
                {recentReceipts.map((tx: any, index: any) => (
                    <View
                        key={index}
                        className={`flex-row items-center justify-between p-5 ${index !== recentReceipts.length - 1 ? "border-b border-slate-100" : ""}`}
                    >
                        <View>
                            <Text className="font-medium text-slate-950">{tx.vendor_name}</Text>
                            <Text className="text-sm text-slate-500">{new Date(tx.receipt_date).toLocaleDateString("fi-FI")}</Text>
                        </View>
                        <Text className="font-semibold text-slate-700">{tx.total_amount} €</Text>
                    </View>
                ))}
            </View>
        </View>
    ) 
};