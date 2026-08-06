import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Report } from "../../types/report";

export default function ReportViewHeader({ period_type, period_start, period_end, vat_declaration_sent }: Report) {
    const navigation = useNavigation<any>();
    return (
        <View className="border-b border-slate-200 bg-white px-4 py-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-sm text-slate-500">← Takaisin raportteihin</Text>
            </TouchableOpacity>

            <View className="mt-1 flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                    <Text className="text-2xl font-semibold tracking-tight text-slate-950">
                        ALV-raportti – {period_type}
                    </Text>
                    <Text className="mt-1 text-sm text-slate-500">
                        {new Date(period_start).toLocaleDateString("fi-FI")} –{" "}
                        {new Date(period_end).toLocaleDateString("fi-FI")}
                    </Text>
                </View>
                <View className={`rounded-full px-3 py-1 ${vat_declaration_sent ? "bg-teal-50" : "bg-amber-50"}`}>
                    <Text className={`text-xs font-medium ${vat_declaration_sent ? "text-teal-700" : "text-amber-700"}`}>
                        {vat_declaration_sent ? "Lähetetty" : "Odottaa"}
                    </Text>
                </View>
            </View>

            <View className="mt-4 flex-row gap-2">
                <TouchableOpacity className="rounded-md bg-red-100 px-4 py-2">
                    <Text className="text-sm font-semibold text-red-700">Poista</Text>
                </TouchableOpacity>
                <TouchableOpacity className="rounded-md bg-teal-600 px-4 py-2">
                    <Text className="text-sm font-semibold text-white">Lataa PDF</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};