import { View, Text, TouchableOpacity } from "react-native";
import { UseReportByIdReturn } from "../../types/report";

export default function ReportViewFooter({ report, handleUpdateReport }: UseReportByIdReturn) {
    return (
        <View className="flex-row items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <View className="flex-1 pr-3">
                <Text className="font-medium text-slate-900">ALV-ilmoitus lähetetty</Text>
                <Text className="mt-0.5 text-sm text-slate-500">Merkitse tämä raportti lähetetyksi Verohallinnolle</Text>
            </View>
            <TouchableOpacity onPress={handleUpdateReport} className={`rounded-lg px-4 py-2 ${report.vat_declaration_sent ? "bg-teal-600" : "border border-slate-200"}`}>
                <Text className={`text-sm font-semibold ${report.vat_declaration_sent ? "text-white" : "text-slate-700"}`}>
                    {report.vat_declaration_sent ? "Lähetetty ✓" : "Ei lähetetty"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};