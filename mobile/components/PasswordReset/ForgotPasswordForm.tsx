import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { UsePasswordResetReturn } from "../../types/auth";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordForm({ setEmail, email, handleSendEmail, isLoading }: UsePasswordResetReturn) {
    const navigation = useNavigation<any>();
    return (
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
                <TouchableOpacity onPress={handleSendEmail} 
                disabled={isLoading} 
                className={`h-11 items-center justify-center rounded-lg bg-slate-950 ${isLoading ? "opacity-60" : ""}`}
                >
                    <Text className="text-sm font-semibold text-white">
                        {isLoading ? "Lähetetään salasanan nollauslinkkiä..." : "Lähetä salasanan nollauslinkki"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text className="text-center text-sm leading-6 text-slate-500">
                        <Text className="font-semibold text-teal-700">Takaisin kirjautumiseen</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}