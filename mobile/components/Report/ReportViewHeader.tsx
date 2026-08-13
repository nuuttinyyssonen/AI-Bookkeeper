import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UseReportByIdReturn } from "../../types/report";

export default function ReportViewHeader({ report, handleDeleteReport, handleDownloadPDF }: UseReportByIdReturn) {
    const navigation = useNavigation<any>();
    return (
        <View className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-sm text-slate-500 dark:text-slate-400">← Takaisin raportteihin</Text>
            </TouchableOpacity>

            <View className="mt-1 flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                    <Text className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                        ALV-raportti – {report.period_type}
                    </Text>
                    <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(report.period_start).toLocaleDateString("fi-FI")} –{" "}
                        {new Date(report.period_end).toLocaleDateString("fi-FI")}
                    </Text>
                </View>
                <View className={`rounded-full px-3 py-1 ${report.vat_declaration_sent ? "bg-teal-50 dark:bg-teal-900" : "bg-amber-50 dark:bg-amber-900"}`}>
                    <Text className={`text-xs font-medium ${report.vat_declaration_sent ? "text-teal-700 dark:text-teal-200" : "text-amber-700 dark:text-amber-200"}`}>
                        {report.vat_declaration_sent ? "Lähetetty" : "Odottaa"}
                    </Text>
                </View>
            </View>

            <View className="mt-4 flex-row gap-2">
                <TouchableOpacity onPress={handleDeleteReport} className="rounded-md bg-red-100 dark:bg-red-800 px-4 py-2">
                    <Text className="text-sm font-semibold text-red-700 dark:text-red-200">Poista</Text>
                </TouchableOpacity>
                <TouchableOpacity className="rounded-md bg-teal-600 px-4 py-2">
                    <Text onPress={handleDownloadPDF} className="text-sm font-semibold text-white">Lataa PDF</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};