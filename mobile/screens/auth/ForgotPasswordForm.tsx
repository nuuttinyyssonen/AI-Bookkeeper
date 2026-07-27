import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native"
import { useState } from "react";
import api from "../../services/api";
import Toast from 'react-native-toast-message';

export default function ForgotPasswordForm({ navigation }: any) {
    const [email, setEmail] = useState("");

    const handleSendEmail = async() => {
        if(!email) {
            return Alert.alert("Virhe", "Syötä sähköpostiosoite");
        }

        try {
            const response = await api.post("/api/auth/reset-password/send-email", {
                email,
                platform: "mobile"
            });
            Toast.show({
                type: "success",
                text1: "Onnistui",
                text2: response.data.message
            });
            
            // Navigate only added for development environment.
            // In production environment navigation would happen from that is sent to email.
            navigation.navigate("ResetPassword", { token: response.data.token });
        } catch(error: any) {
            return Alert.alert(error.response.data?.message || "Virhe, Sähköpostilinkin lähetys epäonnistui");
        }
    };

    return(
        <View className="flex-1 justify-center bg-slate-50 px-4">
            <View className="w-full gap-6 rounded-lg border border-slate-200 bg-white py-6 shadow-xl shadow-slate-950/10">
                <View className="gap-2 px-6">
                    <Text className="text-2xl font-semibold text-slate-950">Sähköpostivahvistuslinkki</Text>
                    <Text className="text-sm leading-6 text-slate-500">Syötä sähköpostiosoitteesi alle</Text>
                </View>
                <View className="gap-4 px-6">
                    <Text>Sähköposti</Text>
                    <TextInput
                        onChangeText={setEmail}
                        value={email}
                        placeholder="m@example.com"
                        autoComplete="email"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <TouchableOpacity onPress={handleSendEmail} className="h-11 items-center justify-center rounded-lg bg-slate-950">
                        <Text className="text-sm font-semibold text-white">Lähetä salasanan nollauslinkki</Text>
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