import { View, ScrollView, ActivityIndicator } from "react-native";

import ReportViewHeader from "../../components/Report/ReportViewHeader";
import VATSummaryCards from "../../components/Report/VATSummaryCards";
import SalesVAT from "../../components/Report/SalesVAT";
import PurchasesVAT from "../../components/Report/PurchasesVAT";
import ReportViewFooter from "../../components/Report/ReportViewFooter";
import { useReportById } from "../../hooks/useReportById";
import { useNavigation } from "@react-navigation/native";

export default function ReportViewScreen({ route }: any) {
    const { id } = route.params;
    const navigation = useNavigation<any>();
    const report = useReportById(id, navigation);

    if (report.isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900">
                <ActivityIndicator size="large" color="#0d9488" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <ReportViewHeader {...report}/>
            <View className="gap-6 px-4 py-6">
                <VATSummaryCards {...report}/>
                <SalesVAT {...report}/>
                <PurchasesVAT {...report}/>
                <ReportViewFooter {...report}/>
            </View>
        </ScrollView>
    );
};
