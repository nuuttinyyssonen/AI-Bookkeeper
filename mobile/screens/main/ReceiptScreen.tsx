import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native"
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function ReceiptScreen({ navigation }: any) {
    const [activeTab, setActiveTab] = useState<"EXPENSE" | "INCOME">("EXPENSE");
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [page, setPage] = useState(1);
    const RECEIPTS_PER_PAGE = 5;

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await api.get("/api/receipt");

                // Filtering receipts to income and expenses tabs
                const expense_receipts = response.data.receipts.filter((r: any) => r.receipt_type === "EXPENSE")
                const income_receipts = response.data.receipts.filter((r: any) => r.receipt_type === "INCOME");

                setExpenses(expense_receipts);
                setIncomes(income_receipts);
            } catch(error: any) {
                Alert.alert("Virhe", "Kuittien hakeminen epäonnistui");
            }
        };
        fetchReceipts();
    }, []);

    // Filter between expenses and incomes
    const receipts = activeTab === "EXPENSE" ? expenses : incomes;

    // Filtering receipts from current page
    const totalPages = Math.max(1, Math.ceil(receipts.length / RECEIPTS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paginatedReceipts = receipts.slice(
        (currentPage - 1) * RECEIPTS_PER_PAGE,
        currentPage * RECEIPTS_PER_PAGE
    );

    const handleChangeTab = (tab: "EXPENSE" | "INCOME") => {
        setActiveTab(tab);
        setPage(1);
    };

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
                        onPress={() => handleChangeTab("EXPENSE")}
                        className={`px-1 pb-3 ${activeTab === "EXPENSE" ? "border-b-2 border-slate-950" : ""}`}
                    >
                        <Text className={`text-sm font-medium ${activeTab === "EXPENSE" ? "text-slate-950" : "text-slate-500"}`}>
                            Kulut ({expenses.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleChangeTab("INCOME")}
                        className={`px-1 pb-3 ${activeTab === "INCOME" ? "border-b-2 border-teal-600" : ""}`}
                    >
                        <Text className={`text-sm font-medium ${activeTab === "INCOME" ? "text-teal-600" : "text-slate-500"}`}>
                            Tulot ({incomes.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="gap-4">
                    {paginatedReceipts.map((r: any) => (
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

                            {r.receiptVats.length > 0 ? (
                                <View className="mt-4 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <Text className="text-sm font-semibold text-slate-700">ALV-erittely</Text>
                                    {r.receiptVats.map((vat: any) => (
                                        <View key={vat.id} className="gap-1">
                                            <Text className="text-sm text-slate-700">Kanta: {vat.rate} %</Text>
                                            <Text className="text-sm text-slate-700">Netto: {vat.net_amount} €</Text>
                                            <Text className="text-sm text-slate-700">ALV: {vat.vat_amount} €</Text>
                                            <Text className="text-sm text-slate-700">Yhteensä: {vat.total} €</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text className="mt-4 text-sm text-slate-500">ALV-erittelyä ei saatavilla</Text>
                            )}

                            <View className="mt-3 flex-row items-center justify-between">
                                <Text className="text-sm text-slate-500">{r.category.label}</Text>
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
                    <TouchableOpacity
                        disabled={currentPage <= 1}
                        onPress={() => setPage((p) => Math.max(1, p - 1))}
                        className={`h-8 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 ${currentPage <= 1 ? "opacity-60" : ""}`}
                    >
                        <Text className="text-sm font-semibold text-slate-700">Edellinen</Text>
                    </TouchableOpacity>
                    <Text className="text-sm text-slate-600">Sivu {currentPage}/{totalPages}</Text>
                    <TouchableOpacity
                        disabled={currentPage >= totalPages}
                        onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className={`h-8 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 ${currentPage >= totalPages ? "opacity-60" : ""}`}
                    >
                        <Text className="text-sm font-semibold text-slate-700">Seuraava</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
};