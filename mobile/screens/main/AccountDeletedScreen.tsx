import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../context/authContext";

export default function AccountDeletedScreen() {
    const { logout } = useAuth();

    const handleGoBack = async () => {
        await logout();
    };

    return (
        <View className="flex-1 items-center justify-center bg-slate-50 px-4">
            <View className="max-w-sm items-center gap-6 text-center">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-teal-600">
                    <Ionicons name="sparkles" size={28} color="white" />
                </View>
                <View className="items-center gap-2">
                    <Text className="text-2xl font-semibold text-slate-900">Tili poistettu</Text>
                    <Text className="text-center text-sm text-slate-500">Tilisi ja kaikki siihen liittyvät tiedot on poistettu pysyvästi.</Text>
                </View>
                <TouchableOpacity
                    onPress={handleGoBack}
                    className="flex-row items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5"
                >
                    <Text className="text-sm font-medium text-white">Takaisin etusivulle</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}