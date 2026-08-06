import { View, ScrollView } from "react-native";

import ReportViewHeader from "../../components/Report/ReportViewHeader";
import VATSummaryCards from "../../components/Report/VATSummaryCards";
import SalesVAT from "../../components/Report/SalesVAT";
import PurchasesVAT from "../../components/Report/PurchasesVAT";
import ReportViewFooter from "../../components/Report/ReportViewFooter";
import { useReportById } from "../../hooks/useReportById";

export default function ReportViewScreen({ route }: any) {
    const { id } = route.params;
    const report = useReportById(id);
    return (
        <ScrollView className="flex-1 bg-slate-50">
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
