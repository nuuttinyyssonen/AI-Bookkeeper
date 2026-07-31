import { View, Text, TouchableOpacity } from "react-native"
import { UseDashboardReturn } from "../../types/dashboard"
import { useNavigation } from "@react-navigation/native"

export default function Header({ handleLogout }: UseDashboardReturn) {
    const navigation = useNavigation<any>();
    
    return (
        <View className="border-b border-slate-200 bg-white px-4 py-4">
            <Text className="text-sm font-medium text-teal-700">Hallintapaneeli</Text>
            <Text className="mt-1 text-2xl font-semibold text-slate-950">Liiketoiminnan yleiskatsaus</Text>

            <View className="mt-4 flex-row gap-2">
                <TouchableOpacity onPress={handleLogout} className="h-10 flex-1 items-center justify-center rounded-md border border-slate-300 bg-white">
                    <Text className="text-sm font-medium text-slate-700">Kirjaudu ulos</Text>
                </TouchableOpacity>
                <TouchableOpacity className="h-10 flex-1 items-center justify-center rounded-md border border-slate-300 bg-white">
                    <Text className="text-sm font-medium text-slate-700">Vie</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Upload")} className="h-10 flex-1 items-center justify-center rounded-md bg-teal-600">
                    <Text className="text-sm font-semibold text-white">Lisää kuitti</Text>
                </TouchableOpacity>
            </View>
        </View>
    ) 
};