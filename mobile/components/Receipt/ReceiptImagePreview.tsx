import { View, Text, Image } from "react-native"
export default function ReceiptImagePreview(receiptView: any) {
    return (
        <View className="gap-6 px-4 py-6">
            <View className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-6 shadow-sm">
                <Text className="text-base font-semibold text-slate-950 dark:text-slate-50">Kuitin kuva</Text>
                <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">Esikatsele tähän kirjaukseen ladattu kuitti.</Text>

                {receiptView.fileUrl ? (
                    <Image
                        source={{ uri: receiptView.fileUrl }}
                        style={{ width: "100%", height: 320, marginTop: 16, borderRadius: 24 }}
                        resizeMode="contain"
                    />
                ) : (
                    <View className="mt-4 h-80 items-center justify-center rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                        <Text className="text-sm text-slate-500 dark:text-slate-400">Esikatselu ei ole saatavilla.</Text>
                    </View>
                )}
            </View>
        </View>
    )
}