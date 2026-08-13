import { View, Text, TouchableOpacity } from "react-native";

export default function Toggelbutton({ isYearly, setIsYearly }: any) {
    return (
        <View className="items-center gap-2">
            {isYearly && (
                <View className="rounded-full border border-teal-200 bg-teal-50 dark:bg-teal-900 px-2 py-0.5">
                    <Text className="text-xs font-medium text-teal-800 dark:text-teal-100">Säästä ~17%</Text>
                </View>
            )}
            <View className="flex-row items-center gap-3">
                <Text className={`text-sm ${!isYearly ? "font-medium text-slate-950 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                    Kuukausittain
                </Text>
                <TouchableOpacity
                    onPress={() => setIsYearly(!isYearly)}
                    className={`h-5 w-10 justify-center rounded-full ${isYearly ? "bg-teal-700" : "bg-slate-200 dark:bg-slate-700"}`}
                >
                    <View className={`h-3.5 w-3.5 rounded-full bg-white dark:bg-slate-950 ${isYearly ? "ml-[22px]" : "ml-[3px]"}`} />
                </TouchableOpacity>
                <Text className={`text-sm ${isYearly ? "font-medium text-slate-950 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                    Vuosittain
                </Text>
            </View>
        </View>
    );
};