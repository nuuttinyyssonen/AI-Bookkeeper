import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const plans = [
    {
        key: "basic",
        name: "Basic",
        description: "Yksityishenkilöille ja freelancereille",
        monthlyPrice: "€19.99",
        yearlyPrice: "€199.99",
        yearlyMonthly: "€16.67",
        popular: false,
        features: ["Rajattomat kuitit", "AI-kirjanpitäjä", "Kuukausiraportit", "Sähköpostituki"],
    },
    {
        key: "premium",
        name: "Premium",
        description: "Pienyrityksille",
        monthlyPrice: "€39.99",
        yearlyPrice: "€399.99",
        yearlyMonthly: "€33.33",
        popular: true,
        features: ["Kaikki Basic-paketista", "Prioriteettituki", "Edistynyt analytiikka", "Monikäyttäjätuki"],
    },
];

export default function SubscriptionPlans() {
    const navigation = useNavigation<any>();
    const [isYearly, setIsYearly] = useState(false);

    return (
        <ScrollView className="flex-1 bg-slate-50">
            <View className="border-b border-slate-200 bg-white px-4 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text className="text-sm text-slate-500">← Takaisin</Text>
                </TouchableOpacity>
                <Text className="mt-1 text-sm font-medium text-teal-700">Tilaus</Text>
                <Text className="text-2xl font-semibold text-slate-950">Valitse tilauksesi</Text>
                <Text className="mt-1 text-sm text-slate-500">Päivitä tai alenna milloin tahansa</Text>
            </View>

            <View className="gap-6 px-4 py-6">
                <View className="items-center gap-2">
                    {isYearly && (
                        <View className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5">
                            <Text className="text-xs font-medium text-teal-800">Säästä ~17%</Text>
                        </View>
                    )}
                    <View className="flex-row items-center gap-3">
                        <Text className={`text-sm ${!isYearly ? "font-medium text-slate-950" : "text-slate-500"}`}>
                            Kuukausittain
                        </Text>
                        <TouchableOpacity
                            onPress={() => setIsYearly(!isYearly)}
                            className={`h-5 w-10 justify-center rounded-full ${isYearly ? "bg-teal-700" : "bg-slate-200"}`}
                        >
                            <View className={`h-3.5 w-3.5 rounded-full bg-white ${isYearly ? "ml-[22px]" : "ml-[3px]"}`} />
                        </TouchableOpacity>
                        <Text className={`text-sm ${isYearly ? "font-medium text-slate-950" : "text-slate-500"}`}>
                            Vuosittain
                        </Text>
                    </View>
                </View>

                <View className="gap-4">
                    {plans.map((plan) => {
                        const price = isYearly ? plan.yearlyMonthly : plan.monthlyPrice;
                        return (
                            <View
                                key={plan.key}
                                className={`relative rounded-lg bg-white p-6 ${
                                    plan.popular ? "border-2 border-slate-200" : "border border-slate-200"
                                }`}
                            >
                                {plan.popular && (
                                    <View className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                                        <Text className="text-xs font-medium text-slate-600">Suosituin</Text>
                                    </View>
                                )}

                                <Text className="text-base font-medium text-slate-950">{plan.name}</Text>
                                <View className="mt-2 flex-row items-baseline gap-1">
                                    <Text className="text-3xl font-semibold text-slate-950">{price}</Text>
                                    <Text className="text-sm text-slate-500">/ kk</Text>
                                </View>
                                {isYearly && (
                                    <Text className="mt-0.5 text-xs text-slate-500">
                                        Laskutetaan {plan.yearlyPrice} / vuosi
                                    </Text>
                                )}
                                <Text className="mt-1 text-sm text-slate-500">{plan.description}</Text>

                                <View className="mt-4 gap-2">
                                    {plan.features.map((feature) => (
                                        <View key={feature} className="flex-row items-center gap-2">
                                            <Ionicons name="checkmark" size={16} color="#0f766e" />
                                            <Text className="flex-1 text-sm text-slate-500">{feature}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View
                                    className={`mt-4 h-10 items-center justify-center rounded-md ${
                                        plan.popular ? "bg-teal-700" : "border border-slate-300 bg-white"
                                    }`}
                                >
                                    <Text className={`text-sm font-medium ${plan.popular ? "text-white" : "text-slate-700"}`}>
                                        Valitse {plan.name}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
};
