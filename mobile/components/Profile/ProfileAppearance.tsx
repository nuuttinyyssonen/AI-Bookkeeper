import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/themeContext";

const options = [
    { key: "light", label: "Vaalea" },
    { key: "dark", label: "Tumma" },
    { key: "system", label: "Järjestelmä" },
] as const;

export default function ProfileAppearance() {
    const { preference, setPreference } = useTheme();

    return (
        <View className="gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <Text className="text-sm font-semibold text-slate-950 dark:text-slate-50">Ulkoasu</Text>

            <View className="flex-row rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                {options.map((option) => {
                    const isActive = preference === option.key;
                    return (
                        <TouchableOpacity
                            key={option.key}
                            onPress={() => setPreference(option.key)}
                            className={`flex-1 items-center py-2 ${
                                isActive ? "bg-slate-950 dark:bg-slate-700" : "bg-white dark:bg-slate-900"
                            }`}
                        >
                            <Text
                                className={`text-xs font-medium ${
                                    isActive ? "text-white" : "text-slate-600 dark:text-slate-300"
                                }`}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
