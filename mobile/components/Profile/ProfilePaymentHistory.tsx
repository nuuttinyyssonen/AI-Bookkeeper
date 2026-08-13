import { View, Text } from "react-native";
import { UseProfileReturn } from "../../types/profile";

export default function ProfilePaymentHistory({ paymentHistory }: UseProfileReturn) {
    return (
        <View className="gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
            <Text className="text-sm font-semibold text-slate-950 dark:text-slate-50">Maksuhistoria</Text>
            <View className="divide-y divide-slate-100 dark:divide-slate-800">
                {paymentHistory.map((payment, key) => (
                    <View className="flex-row items-center justify-between py-3" key={key}>
                        <View>
                            <Text className="text-sm font-medium text-slate-950 dark:text-slate-50">{payment.description}</Text>
                            <Text className="text-xs text-slate-500 dark:text-slate-400">{payment.date}</Text>
                        </View>
                        <View className="flex-row items-center gap-3">
                            <View className="rounded-full border border-teal-200 bg-teal-50 dark:bg-teal-900 px-2 py-0.5">
                                <Text className="text-xs font-medium text-teal-800 dark:text-teal-100">{payment.status}</Text>
                            </View>
                            <Text className="text-sm font-medium text-slate-950 dark:text-slate-50">{payment.amount} €</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};