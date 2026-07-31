import { View, TouchableOpacity, Text } from "react-native"

export default function ReceiptHeader({ navigation }: any) {
    return (
        <View className="border-b border-slate-200 bg-white px-4 py-4">
            <Text className="text-2xl font-semibold text-slate-950">Kuitin tiedot</Text>
            <Text className="mt-1 text-sm text-slate-500">Tarkastele kuitin tietoja, kuvaa ja toimintovaihtoehtoja.</Text>
            <TouchableOpacity 
                onPress={() => navigation.navigate("Main", { screen: "Receipts" })}
                className="h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4"
            >
                <Text className="text-sm font-semibold text-slate-950">Takaisin</Text>
            </TouchableOpacity>
        </View>
    )
}