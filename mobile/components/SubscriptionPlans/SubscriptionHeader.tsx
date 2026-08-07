import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SubscriptionHeader() {
    const navigation = useNavigation<any>();
    return (
        <View className="border-b border-slate-200 bg-white px-4 py-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-sm text-slate-500">← Takaisin</Text>
            </TouchableOpacity>
            <Text className="mt-1 text-sm font-medium text-teal-700">Tilaus</Text>
            <Text className="text-2xl font-semibold text-slate-950">Valitse tilauksesi</Text>
            <Text className="mt-1 text-sm text-slate-500">Päivitä tai alenna milloin tahansa</Text>
        </View>
    );
};