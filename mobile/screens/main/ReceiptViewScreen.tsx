import { View, Text, ScrollView } from "react-native";
import { useReceiptView } from "../../hooks/useReceiptView";

import ReceiptHeader from "../../components/Receipt/ReceiptHeader";
import ReceiptCard from "../../components/Receipt/ReceiptCard";
import ReceiptImagePreview from "../../components/Receipt/ReceiptImagePreview";

export default function ReceiptViewScreen({ navigation, route }: any) {
    const { id } = route.params;
    const receiptView = useReceiptView(id, navigation);

    // Showing loading screen when data is not fetched yet.
    if(!receiptView.receipt) {
        return (
            <View className="flex-1 bg-slate-50 dark:bg-slate-900 px-4 py-8">
                <View className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-8 shadow-sm">
                    <Text className="text-lg font-semibold text-slate-900 dark:text-slate-50">Ladataan...</Text>
                </View>
            </View>
        )
    }

    return (
        <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <ReceiptHeader navigation={navigation}/>
            <ReceiptCard receiptView={receiptView} />
            <ReceiptImagePreview receiptView={receiptView}/>
        </ScrollView>
    )
};