import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { UseLoginReturn } from "../../types/auth"
import { useNavigation } from "@react-navigation/native"

export default function LoginForm({ setEmail, email, setPassword, password, handleLogin }: UseLoginReturn) {
    const navigation = useNavigation<any>();
    return (
        <View className="w-full gap-6 rounded-lg border border-slate-200 bg-white py-6 shadow-xl shadow-slate-950/10">
            <View className="gap-2 px-6">
                <Text className="text-2xl font-semibold text-slate-950">Kirjaudu sisään</Text>
                <Text className="text-sm leading-6 text-slate-500">Syötä tietosi jatkaaksesi työtilaan</Text>
            </View>
            <View className="gap-4 px-6">
                <TextInput
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Sähköposti"
                    autoComplete="email"
                    className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                    placeholderTextColor="#94a3b8"
                />
                <TextInput
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Salasana"
                    secureTextEntry
                    autoComplete="password"
                    className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                    placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity onPress={handleLogin} className="h-11 items-center justify-center rounded-lg bg-slate-950">
                    <Text className="text-sm font-semibold text-white">Kirjaudu</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text className="text-center text-sm leading-6 text-slate-500">
                        Uusi käyttäjä? <Text className="font-semibold text-teal-700">Luo tili</Text>
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordForm")}>
                    <Text className="text-center text-sm leading-6 text-slate-500">
                        Unohditko salasanasi? <Text className="font-semibold text-teal-700">Palauta salasana</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};