import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { useState } from "react"
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function LoginForm({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await api.post('/api/auth/login', {
                email,
                password
            });
            await login(response.data.user.token);
        } catch(error: any) {
            Alert.alert("Virhe", error.response?.data?.message || "Kirjautuminen epäonnistui");
        }
    };

    return(
        <View className="flex-1 justify-center bg-slate-50 px-4">
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
                    <TouchableOpacity onPress={() => navigation.navigate("PasswordReset")}>
                        <Text className="text-center text-sm leading-6 text-slate-500">
                            Unohditko salasanasi? <Text className="font-semibold text-teal-700">Palauta salasana</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}