import { View, Text, TouchableOpacity } from "react-native";

export default function NoReport() {
    return (
        <View className="items-center rounded-xl border border-dashed border-slate-200 bg-white p-16">
            <Text className="text-lg font-semibold text-slate-900">Ei vielä raportteja</Text>
            <Text className="mt-2 text-center text-sm text-slate-500">
                Luo ensimmäinen ALV-raporttisi valmistautuaksesi veroilmoitukseen.
            </Text>
            <TouchableOpacity className="mt-6 rounded-md bg-teal-600 px-4 py-2">
                <Text className="text-sm font-semibold text-white">+ Uusi raportti</Text>
            </TouchableOpacity>
        </View>
    );
};