import { View, Text, ScrollView } from "react-native"
import IncomeUpload from "../../components/Upload/IncomeUpload"
import ExpenseUpload from "../../components/Upload/ExpenseUpload";
import { useUpload } from "../../hooks/useUpload"

export default function UploadScreen() {
    const upload = useUpload();
    return (
        <ScrollView className="flex-1 bg-slate-50">
            <View className="border-b border-slate-200 bg-white px-4 py-4">
                <Text className="text-2xl font-semibold text-slate-950">Lisää kuitti</Text>
                <Text className="mt-1 text-sm text-slate-500">Lataa kuitti kamerasta, galleriasta tai tiedostoista.</Text>
            </View>

            <View className="gap-4 px-4 py-6">
                <ExpenseUpload {...upload} />
                <IncomeUpload {...upload} />
            </View>
        </ScrollView>
    )
}
