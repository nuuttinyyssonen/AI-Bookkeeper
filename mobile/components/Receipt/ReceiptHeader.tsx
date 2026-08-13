import { View, TouchableOpacity, Text } from "react-native"

export default function ReceiptHeader({ navigation }: any) {
    return (
        <View className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-4">
            <Text className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Kuitin tiedot</Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tarkastele kuitin tietoja, kuvaa ja toimintovaihtoehtoja.</Text>
            <TouchableOpacity 
                onPress={() => navigation.navigate("Main", { screen: "Receipts" })}
                className="h-11 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4"
            >
                <Text className="text-sm font-semibold text-slate-950 dark:text-slate-50">Takaisin</Text>
            </TouchableOpacity>
        </View>
    )
}