import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { UseAssistantScreenReturn } from "../../types/assistant"

export default function Start({ suggestions, setInput }: UseAssistantScreenReturn) {
    return (
        <View className="flex-1 items-center justify-center px-6">
            <View className="mb-6 items-center">
                <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-teal-600">
                    <Ionicons name="sparkles" size={26} color="white" />
                </View>
                <Text className="text-xl font-semibold text-slate-900 dark:text-slate-50">Hei Nuutti!</Text>
                <Text className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                    Kysy mitä tahansa kirjanpidosta, kuiteista tai raporteista
                </Text>
            </View>

            <View className="flex-row flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                    <TouchableOpacity
                        key={suggestion}
                        onPress={() => setInput(suggestion)}
                        className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 shadow-sm"
                    >
                        <Text className="text-sm text-slate-600 dark:text-slate-300">{suggestion}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}