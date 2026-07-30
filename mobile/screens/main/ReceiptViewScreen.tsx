import { useEffect, useState } from "react";
import { View, Alert, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import api from "../../services/api";

export default function ReceiptViewScreen({ navigation, route }: any) {
    const { id } = route.params;
    const [receipt, setReceipt] = useState<any>();
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleDownload = async (receipt_id: string) => {
        const response = await api.get(`/api/storage/fileUrl/${receipt_id}`);
        setFileUrl(response.data.url);
    };

    useEffect(() => {
        const fetchReceiptById = async() => {
            try {
                const response = await api.get(`/api/receipt/${id}`);
                setReceipt(response.data.receipt);
                await handleDownload(id);
            } catch(error: any) {
                return Alert.alert(error.response.data?.message || "Virhe, Kuitin hakeminen epäonnistui");
            }
        };
        fetchReceiptById();
    }, []);

    const handleNavigateToReceipts = () => {

    };

    if(!receipt) {
        return (
            <View className="flex-1 bg-slate-50 px-4 py-8">
                <View className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <Text className="text-lg font-semibold text-slate-900">Ladataan...</Text>
                </View>
            </View>
        )
    }

    return (
        <ScrollView className="flex-1 bg-slate-50">
            <View className="border-b border-slate-200 bg-white px-4 py-4">
                <Text className="text-2xl font-semibold text-slate-950">Kuitin tiedot</Text>
                <Text className="mt-1 text-sm text-slate-500">Tarkastele kuitin tietoja, kuvaa ja toimintovaihtoehtoja.</Text>
            </View>

            <View className="gap-6 px-4 py-6">
                <View className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <View className="flex-row items-start justify-between">
                        <View>
                            <Text className="mb-1 text-xs text-slate-500">Toimittaja</Text>
                            <Text className="text-lg font-semibold text-slate-950">{receipt.vendor_name}</Text>
                        </View>
                    </View>

                    <View className="mt-4 flex-row items-end justify-between">
                        <View>
                            <Text className="mb-1 text-xs text-slate-500">Päivämäärä</Text>
                            <Text className="text-sm text-slate-700">
                                {new Date(receipt.receipt_date).toLocaleDateString("fi-FI")}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="mb-1 text-xs text-slate-500">Yhteensä</Text>
                            <Text className="text-lg font-semibold text-slate-950">{receipt.total_amount} €</Text>
                        </View>
                    </View>

                    {receipt.receiptVats.length > 0 ? (
                        <View className="mt-4 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <Text className="text-sm font-semibold text-slate-700">ALV-erittely</Text>
                            {receipt.receiptVats.map((vat: any) => (
                                <View key={vat.id} className="flex-row flex-wrap gap-x-4 gap-y-1">
                                    <Text className="text-sm text-slate-700">Kanta: {vat.rate} %</Text>
                                    <Text className="text-sm text-slate-700">Netto: {vat.net_amount} €</Text>
                                    <Text className="text-sm text-slate-700">ALV: {vat.vat_amount} €</Text>
                                    <Text className="text-sm text-slate-700">Yhteensä: {vat.total} €</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text className="mt-4 text-sm text-slate-500">ALV-tietoja ei saatavilla.</Text>
                    )}

                    <View className="mt-6 flex-row flex-wrap gap-3">
                        <TouchableOpacity onPress={handleNavigateToReceipts} className="h-9 items-center justify-center rounded-md bg-red-600 px-4">
                            <Text className="text-sm font-semibold text-white">Poista kuitti</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="h-9 items-center justify-center rounded-md bg-teal-600 px-4">
                            <Text className="text-sm font-semibold text-white">Lataa PDF</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <Text className="text-base font-semibold text-slate-950">Kuitin kuva</Text>
                    <Text className="mt-1 text-sm text-slate-500">Esikatsele tähän kirjaukseen ladattu kuitti.</Text>

                    {fileUrl ? (
                        <Image
                            source={{ uri: fileUrl }}
                            style={{ width: "100%", height: 320, marginTop: 16, borderRadius: 24 }}
                            resizeMode="contain"
                        />
                    ) : (
                        <View className="mt-4 h-80 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100">
                            <Text className="text-sm text-slate-500">Esikatselu ei ole saatavilla.</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    )
};