import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { UseAssistantScreenReturn } from "../../types/assistant";

export default function Header({ setHistoryOpen }: UseAssistantScreenReturn) {

    return (
        <View className="flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-4">
            <View className="flex-row items-center gap-3">
                <TouchableOpacity
                    onPress={() => setHistoryOpen(true)}
                    className="h-9 w-9 items-center justify-center rounded-lg"
                >
                    <Ionicons name="menu" size={20} color="#334155" />
                </TouchableOpacity>
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
                    <Ionicons name="sparkles" size={18} color="white" />
                </View>
                <View>
                    <Text className="text-base font-semibold text-slate-900 dark:text-slate-50">AI-avustaja</Text>
                    <Text className="text-xs text-slate-500 dark:text-slate-400">Kysy kirjanpidosta, kuiteista tai raporteista</Text>
                </View>
            </View>
        </View>
    )
};