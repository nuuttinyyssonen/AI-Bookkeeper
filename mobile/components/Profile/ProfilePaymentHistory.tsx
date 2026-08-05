import { View, Text } from "react-native";

export default function ProfilePaymentHistory() {
    return (
        <View className="gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Text className="text-sm font-semibold text-slate-950">Maksuhistoria</Text>

            <View className="divide-y divide-slate-100">
                <View className="flex-row items-center justify-between py-3">
                    <View>
                        <Text className="text-sm font-medium text-slate-950">Premium-tilaus</Text>
                        <Text className="text-xs text-slate-500">1.7.2026</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <View className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5">
                            <Text className="text-xs font-medium text-teal-800">Maksettu</Text>
                        </View>
                        <Text className="text-sm font-medium text-slate-950">29,00 €</Text>
                    </View>
                </View>
                <View className="flex-row items-center justify-between py-3">
                    <View>
                        <Text className="text-sm font-medium text-slate-950">Premium-tilaus</Text>
                        <Text className="text-xs text-slate-500">1.6.2026</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <View className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5">
                            <Text className="text-xs font-medium text-teal-800">Maksettu</Text>
                        </View>
                        <Text className="text-sm font-medium text-slate-950">29,00 €</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};