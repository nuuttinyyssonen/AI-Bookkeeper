import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native"
import { useState } from "react";

const mockExpenseReceipts = [
    {
        id: "1",
        vendor_name: "K-Market Kauppatori",
        receipt_date: "2026-07-24",
        total_amount: "84,90",
        category: "Ravintola & kahvila",
        is_deductible: true,
        vats: [
            { id: "1a", rate: "24%", net: "68,47", vat: "16,43", total: "84,90" },
        ],
    },
    {
        id: "2",
        vendor_name: "Elisa Oyj",
        receipt_date: "2026-07-20",
        total_amount: "39,90",
        category: "Puhelin & internet",
        is_deductible: true,
        vats: [
            { id: "2a", rate: "25,5%", net: "31,79", vat: "8,11", total: "39,90" },
        ],
    },
    {
        id: "3",
        vendor_name: "Neste Oyj",
        receipt_date: "2026-07-15",
        total_amount: "62,30",
        category: "Matkakulut",
        is_deductible: false,
        vats: [],
    },
];

const mockIncomeReceipts = [
    {
        id: "4",
        vendor_name: "Yritysasiakas Oy",
        receipt_date: "2026-07-22",
        total_amount: "1 250,00",
        category: "Konsultointi",
        is_deductible: true,
        vats: [
            { id: "4a", rate: "25,5%", net: "996,02", vat: "253,98", total: "1 250,00" },
        ],
    },
];

export default function ReceiptScreen({ navigation }: any) {
    const [activeTab, setActiveTab] = useState<"EXPENSE" | "INCOME">("EXPENSE");
    const receipts = activeTab === "EXPENSE" ? mockExpenseReceipts : mockIncomeReceipts;

    const handleNavigateToReceipt = (id: string) => {
        navigation.navigate("ReceiptView", { id });
    };

    return (
        <ScrollView className="flex-1 bg-slate-50">
            <View className="border-b border-slate-200 bg-white px-4 py-4">
                <Text className="text-2xl font-semibold text-slate-950">Kuitit</Text>
                <Text className="mt-1 text-sm text-slate-500">Ladatut kuittisi ja analysoidut summat.</Text>

                <TextInput
                    placeholder="Hae kuittia..."
                    placeholderTextColor="#94a3b8"
                    className="mt-4 h-10 rounded-md border border-slate-200 px-3 text-sm text-slate-700"
                />
            </View>

            <View className="gap-6 px-4 py-6">
                <View className="flex-row gap-2 border-b border-slate-200">
                    <TouchableOpacity
                        onPress={() => setActiveTab("EXPENSE")}
                        className={`px-1 pb-3 ${activeTab === "EXPENSE" ? "border-b-2 border-slate-950" : ""}`}
                    >
                        <Text className={`text-sm font-medium ${activeTab === "EXPENSE" ? "text-slate-950" : "text-slate-500"}`}>
                            Kulut ({mockExpenseReceipts.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab("INCOME")}
                        className={`px-1 pb-3 ${activeTab === "INCOME" ? "border-b-2 border-teal-600" : ""}`}
                    >
                        <Text className={`text-sm font-medium ${activeTab === "INCOME" ? "text-teal-600" : "text-slate-500"}`}>
                            Tulot ({mockIncomeReceipts.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="gap-4">
                    {receipts.map((r: any) => (
                        <View key={r.id} className="rounded-md border border-slate-200 bg-white p-5">
                            <View className="flex-row items-start justify-between">
                                <View>
                                    <Text className="text-base font-semibold text-slate-950">{r.vendor_name}</Text>
                                    <Text className="mt-1 text-sm text-slate-500">
                                        {new Date(r.receipt_date).toLocaleDateString("fi-FI")}
                                    </Text>
                                </View>
                                <Text className="text-lg font-semibold text-slate-950">{r.total_amount} €</Text>
                            </View>

                            {r.vats.length > 0 ? (
                                <View className="mt-4 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <Text className="text-sm font-semibold text-slate-700">ALV-erittely</Text>
                                    {r.vats.map((vat: any) => (
                                        <View key={vat.id} className="gap-1">
                                            <Text className="text-sm text-slate-700">Kanta {vat.rate}</Text>
                                            <Text className="text-sm text-slate-700">Netto {vat.net} €</Text>
                                            <Text className="text-sm text-slate-700">ALV {vat.vat} €</Text>
                                            <Text className="text-sm text-slate-700">Yhteensä {vat.total} €</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text className="mt-4 text-sm text-slate-500">ALV-erittelyä ei saatavilla</Text>
                            )}

                            <View className="mt-3 flex-row items-center justify-between">
                                <Text className="text-sm text-slate-500">{r.category}</Text>
                                <Text className={`text-sm font-medium ${r.is_deductible ? "text-teal-600" : "text-red-500"}`}>
                                    {r.is_deductible ? "Vähennyskelpoinen" : "Ei vähennyskelpoinen"}
                                </Text>
                            </View>

                            <View className="mt-4 flex-row gap-2">
                                <TouchableOpacity onPress={() => handleNavigateToReceipt(r.id)} className="h-11 flex-1 items-center justify-center rounded-lg bg-slate-950">
                                    <Text className="text-sm font-semibold text-white">Näytä</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="h-11 flex-1 items-center justify-center rounded-lg bg-teal-600">
                                    <Text className="text-sm font-semibold text-white">Vie</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <View className="mt-2 flex-row items-center justify-center gap-3">
                    <TouchableOpacity disabled className="h-8 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 opacity-60">
                        <Text className="text-sm font-semibold text-slate-700">Edellinen</Text>
                    </TouchableOpacity>
                    <Text className="text-sm text-slate-600">Sivu 1/1</Text>
                    <TouchableOpacity disabled className="h-8 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 opacity-60">
                        <Text className="text-sm font-semibold text-slate-700">Seuraava</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
};