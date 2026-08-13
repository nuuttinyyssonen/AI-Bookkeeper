import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable, ActivityIndicator } from "react-native";
import ReportCard from "../../components/Report/ReportCard";
import NoReport from "../../components/Report/NoReport";
import { useReport } from "../../hooks/useReport";

const TIME_PERIODS: { value: string; label: string }[] = [
    { value: "YEARLY", label: "Kuluva vuosi" },
    { value: "Monthly", label: "Kuluva kuukausi" },
    { value: "Q1", label: "Q1 (tammi - maalis)" },
    { value: "Q2", label: "Q2 (huhti - kesä)" },
    { value: "Q3", label: "Q3 (heinä - syys)" },
    { value: "Q4", label: "Q4 (loka - joulu)" },
];

export default function ReportScreen({ navigation }: any) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigateToReport = (id: string) => {
        navigation.navigate("ReportView", { id });
    };

    const { reports, handleCreateReport, isLoading } = useReport();

    const handleSelectTimePeriod = (timePeriod: string) => {
        setIsMenuOpen(false);
        handleCreateReport(timePeriod);
    };

    return (
        <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <View className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-4">
                <Text className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Raportit</Text>
                <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">ALV-raporttisi veroilmoitusta varten.</Text>
                <TouchableOpacity onPress={() => setIsMenuOpen(true)} className="mt-6 rounded-md bg-teal-600 px-4 py-2">
                    <Text className="text-sm font-semibold text-white">+ Uusi raportti</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={isMenuOpen} transparent animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
                <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setIsMenuOpen(false)}>
                    <Pressable className="rounded-t-2xl bg-white dark:bg-slate-950 p-4">
                        <Text className="mb-2 px-2 text-base font-semibold text-slate-950 dark:text-slate-50">Valitse ajanjakso</Text>
                        {TIME_PERIODS.map(({ value, label }) => (
                            <TouchableOpacity
                                key={value}
                                onPress={() => handleSelectTimePeriod(value)}
                                className="rounded-lg px-3 py-3"
                            >
                                <Text className="text-sm text-slate-700 dark:text-slate-200">{label}</Text>
                            </TouchableOpacity>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>

            <View className="px-4 py-6">
                {isLoading ? (
                    <View className="items-center justify-center py-12">
                        <ActivityIndicator size="large" color="#0d9488" />
                    </View>
                ) : reports.length > 0 ? (
                    <View className="gap-4">
                        {reports.map((report) => {
                            return (
                                <ReportCard key={report.id} {...report} handleNavigateToReport={handleNavigateToReport}/>
                            );
                        })}
                    </View>
                ) : (
                    <NoReport />
                )}
            </View>
        </ScrollView>
    );
};
