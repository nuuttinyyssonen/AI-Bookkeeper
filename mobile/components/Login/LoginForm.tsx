import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { UseLoginReturn } from "../../types/auth"
import { useNavigation } from "@react-navigation/native"

export default function LoginForm({ setEmail, email, setPassword, password, handleLogin, isLoading }: UseLoginReturn) {
    const navigation = useNavigation<any>();
    return (
        <View className="w-full gap-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 py-6 shadow-xl shadow-slate-950/10">
            <View className="gap-2 px-6">
                <Text className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Kirjaudu sisään</Text>
                <Text className="text-sm leading-6 text-slate-500 dark:text-slate-400">Syötä tietosi jatkaaksesi työtilaan</Text>
            </View>
            <View className="gap-4 px-6">
                <TextInput
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Sähköposti"
                    autoComplete="email"
                    className="h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-950 dark:text-slate-50"
                    placeholderTextColor="#94a3b8"
                />
                <TextInput
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Salasana"
                    secureTextEntry
                    autoComplete="password"
                    className="h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-950 dark:text-slate-50"
                    placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity onPress={handleLogin} 
                disabled={isLoading} 
                className={`h-11 items-center justify-center rounded-lg bg-slate-950 dark:bg-slate-800 ${isLoading ? "opacity-60" : ""}`}
                >
                    <Text className="text-sm font-semibold text-white">
                        {isLoading ? "Kirjaudutaan..." : "Kirjaudu sisään"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text className="text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Uusi käyttäjä? <Text className="font-semibold text-teal-700 dark:text-teal-200">Luo tili</Text>
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordForm")}>
                    <Text className="text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Unohditko salasanasi? <Text className="font-semibold text-teal-700 dark:text-teal-200">Palauta salasana</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};