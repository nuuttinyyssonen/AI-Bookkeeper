import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native"
import { useState } from "react";
import api from "../../services/api";
import Toast from 'react-native-toast-message';

export default function ResetPasswordForm({ navigation, route }: any) {
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const { token } = route.params;

    const handleResetPassword = async() => {
        if(!password || !passwordRepeat) {
            return Alert.alert("Virhe", "Syötä molemmat kentät");
        }

        if(password !== passwordRepeat) {
            return Alert.alert("Virhe", "Salasanat eivät täsmää");
        }

        try {
            const response = await api.post(`/api/auth/reset-password/${token}`, {
                password,
                passwordRepeat
            });
            Toast.show({
                type: "success",
                text1: "Onnistui",
                text2: response.data.message
            });

            navigation.navigate("Login");
        } catch(error: any) {
            return Alert.alert("Virhe", "Salasanan vaihtaminen epäonnistui");
        }
    };

    return(
        <View className="flex-1 justify-center bg-slate-50 px-4">
            <View className="w-full gap-6 rounded-lg border border-slate-200 bg-white py-6 shadow-xl shadow-slate-950/10">
                <View className="gap-2 px-6">
                    <Text className="text-2xl font-semibold text-slate-950">Palauta salasana</Text>
                    <Text className="text-sm leading-6 text-slate-500">Syötä salasana alle</Text>
                </View>
                <View className="gap-4 px-6">
                    <Text>Salasana</Text>
                    <TextInput
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Salasana"
                        secureTextEntry
                        autoComplete="password"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <Text>Vahvista salasana</Text>
                    <TextInput
                        onChangeText={setPasswordRepeat}
                        value={passwordRepeat}
                        placeholder="Vahvista salasana"
                        secureTextEntry
                        autoComplete="password"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <TouchableOpacity onPress={handleResetPassword} className="h-11 items-center justify-center rounded-lg bg-slate-950">
                        <Text className="text-sm font-semibold text-white">Vaihda salasana</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text className="text-center text-sm leading-6 text-slate-500">
                            <Text className="font-semibold text-teal-700">Takaisin kirjautumiseen</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}