import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { UsePasswordResetReturn } from "../../types/auth";
import { useNavigation } from "@react-navigation/native";

export default function ResetPasswordForm({ setPassword, password, handleResetPassword, setPasswordRepeat, passwordRepeat, isLoading }: UsePasswordResetReturn) {
    const navigation = useNavigation<any>();
    return (
        <View className="w-full gap-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 py-6 shadow-xl shadow-slate-950/10">
            <View className="gap-2 px-6">
                <Text className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Palauta salasana</Text>
                <Text className="text-sm leading-6 text-slate-500 dark:text-slate-400">Syötä salasana alle</Text>
            </View>
            <View className="gap-4 px-6">
                <Text className="text-sm font-medium text-slate-800 dark:text-slate-100">Salasana</Text>
                <TextInput
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Salasana"
                    secureTextEntry
                    autoComplete="password"
                    className="h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-950 dark:text-slate-50"
                    placeholderTextColor="#94a3b8"
                />
                <Text className="text-sm font-medium text-slate-800 dark:text-slate-100">Vahvista salasana</Text>
                <TextInput
                    onChangeText={setPasswordRepeat}
                    value={passwordRepeat}
                    placeholder="Vahvista salasana"
                    secureTextEntry
                    autoComplete="password"
                    className="h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-950 dark:text-slate-50"
                    placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity onPress={handleResetPassword}
                disabled={isLoading} 
                className={`h-11 items-center justify-center rounded-lg bg-slate-950 dark:bg-slate-800 ${isLoading ? "opacity-60" : ""}`}
                >
                    <Text className="text-sm font-semibold text-white">{isLoading ? "Vaihdetaan salasana" : "Vaihda salasana"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text className="text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                        <Text className="font-semibold text-teal-700 dark:text-teal-200">Takaisin kirjautumiseen</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}