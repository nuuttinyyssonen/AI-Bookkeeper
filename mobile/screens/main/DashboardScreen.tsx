import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native"
import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function DashboardScreen({ navigation }: any) {
    const { logout } = useAuth();
    const [revenue, setRevenue] = useState("");
    const [expenses, setExpenses] = useState("");
    const [netProfit, setNetProfit] = useState("");

    const [recentReceipts, setRecentReceipts] = useState([]);
    const [cashflow, setCashflow] = useState([]);

    const [subscriptionType, setSusbcriptionType] = useState("");

    const maxCashflowValue = Math.max(0, ...cashflow.map((item: any) => Math.max(Number(item.income), Number(item.expense))));
    const toPercent = (value: number) => maxCashflowValue === 0 ? 0 : Math.round((Number(value) / maxCashflowValue) * 100);

    const handleLogout = async () => {
        await logout();
    };

    useEffect(() => {
        const fetchUserData = async() => {
            try {
                // Fetching data for revenue, expenses, net_profit and recent_receipts
                const response = await api.get("/api/dashboard");
                setRevenue(response.data.revenue._sum.total_amount);
                setExpenses(response.data.expenses._sum.total_amount);
                setNetProfit(response.data.net_profit);
                setRecentReceipts(response.data.recent_receipts);

                // Cashflow
                const cashflow_response = await api.get('/api/dashboard/cashflow');
                setCashflow(cashflow_response.data.cashflow)

                // Subscription status
                const subscription_status_response = await api.get('/api/user/subscription');
                setSusbcriptionType(subscription_status_response.data.subscription.subscription_type);

            } catch(error: any) {
                return Alert.alert("Virhe", "Käyttäjän datan hakeminen epäonnistui");
            }
        };
        fetchUserData();
    }, []);

    return(
        <ScrollView className="flex-1 bg-slate-50">
            <View className="border-b border-slate-200 bg-white px-4 py-4">
                <Text className="text-sm font-medium text-teal-700">Hallintapaneeli</Text>
                <Text className="mt-1 text-2xl font-semibold text-slate-950">Liiketoiminnan yleiskatsaus</Text>

                <View className="mt-4 flex-row gap-2">
                    <TouchableOpacity onPress={handleLogout} className="h-10 flex-1 items-center justify-center rounded-md border border-slate-300 bg-white">
                        <Text className="text-sm font-medium text-slate-700">Kirjaudu ulos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} className="h-10 flex-1 items-center justify-center rounded-md border border-slate-300 bg-white">
                        <Text className="text-sm font-medium text-slate-700">Vie</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} className="h-10 flex-1 items-center justify-center rounded-md bg-teal-600">
                        <Text className="text-sm font-semibold text-white">Lisää kuitti</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="gap-6 px-4 py-6">
                <View className="flex-row items-center justify-between rounded-lg border border-teal-200 bg-teal-50 px-4 py-3">
                    {subscriptionType ? (
                        <>
                            <Text className="flex-1 text-sm text-teal-800">Olen {subscriptionType} paketissa</Text>
                            <Text className="text-sm font-medium text-teal-800 underline">
                                {subscriptionType === "BASIC" ? "Päivitä Premiumiin" : "Selaa paketteja"}
                            </Text>
                        </>
                    ) : (
                        <Text className="text-sm text-teal-800">Tilaus ei ole aktiivinen</Text>
                    )}
                </View>

                <View className="gap-4">
                    <View className="rounded-md border border-slate-200 bg-white p-5">
                        <View className="h-1.5 w-12 rounded-full bg-teal-600" />
                        <Text className="mt-4 text-sm text-slate-500">Liikevaihto</Text>
                        <Text className="mt-2 text-2xl font-semibold text-slate-950">{(Number(revenue) ?? 0).toFixed(2)} €</Text>
                    </View>
                    <View className="rounded-md border border-slate-200 bg-white p-5">
                        <View className="h-1.5 w-12 rounded-full bg-rose-500" />
                        <Text className="mt-4 text-sm text-slate-500">Kulut</Text>
                        <Text className="mt-2 text-2xl font-semibold text-slate-950">{(Number(expenses) ?? 0).toFixed(2)} €</Text>
                    </View>
                    <View className="rounded-md border border-slate-200 bg-white p-5">
                        <View className="h-1.5 w-12 rounded-full bg-slate-900" />
                        <Text className="mt-4 text-sm text-slate-500">Nettotulos</Text>
                        <Text className="mt-2 text-2xl font-semibold text-slate-950">{(Number(netProfit) ?? 0).toFixed(2)} €</Text>
                    </View>
                </View>

                <View className="rounded-md border border-slate-200 bg-white p-5">
                    <Text className="text-lg font-semibold text-slate-950">Kassavirta</Text>
                    <Text className="text-sm text-slate-500">Tulojen ja menojen kehitys</Text>

                    <View className="mt-4 flex-row gap-4">
                        <View className="flex-row items-center gap-2">
                            <View className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                            <Text className="text-sm text-slate-700">Tulot</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <View className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                            <Text className="text-sm text-slate-700">Menot</Text>
                        </View>
                    </View>

                    <View className="mt-6 h-40 flex-row items-end justify-between border-b border-slate-200 pb-4">
                        {cashflow.map((item: any) => (
                            <View key={item.month} className="flex-1 items-center justify-end gap-2 h-full">
                                <View className="flex-1 flex-row items-end justify-center gap-1">
                                    <View className="w-2 rounded-t-md bg-teal-600" style={{ height: `${toPercent(item.income)}%` }} />
                                    <View className="w-2 rounded-t-md bg-amber-500" style={{ height: `${toPercent(item.expense)}%` }} />
                                </View>
                                <Text className="text-xs font-medium text-slate-500">{item.month}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="rounded-md border border-slate-200 bg-white">
                    <View className="border-b border-slate-200 p-5">
                        <Text className="text-lg font-semibold text-slate-950">Viimeisimmät tapahtumat</Text>
                    </View>
                    <View>
                        {recentReceipts.map((tx: any, index) => (
                            <View
                                key={index}
                                className={`flex-row items-center justify-between p-5 ${index !== recentReceipts.length - 1 ? "border-b border-slate-100" : ""}`}
                            >
                                <View>
                                    <Text className="font-medium text-slate-950">{tx.vendor_name}</Text>
                                    <Text className="text-sm text-slate-500">{new Date(tx.receipt_date).toLocaleDateString("fi-FI")}</Text>
                                </View>
                                <Text className="font-semibold text-slate-700">{tx.total_amount} €</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    )
};