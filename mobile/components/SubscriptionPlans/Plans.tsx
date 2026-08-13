import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const plans = [
    {
        key: "basic",
        name: "Basic",
        id: "BASIC",
        yearlyId: "BASIC_YEARLY",
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
        id: "PREMIUM",
        yearlyId: "PREMIUM_YEARLY",
        description: "Pienyrityksille",
        monthlyPrice: "€39.99",
        yearlyPrice: "€399.99",
        yearlyMonthly: "€33.33",
        popular: true,
        features: ["Kaikki Basic-paketista", "Prioriteettituki", "Edistynyt analytiikka", "Monikäyttäjätuki"],
    },
];

export default function Plans({ isYearly, selectedPlan, pendingPlanId, handleChangePlan }: any) {
    return (
        <View className="gap-4">
            {plans.map((plan) => {
                const price = isYearly ? plan.yearlyMonthly : plan.monthlyPrice;
                const planId = isYearly ? plan.yearlyId : plan.id;
                const isCurrent = selectedPlan === planId;
                const isPending = pendingPlanId === planId;
                return (
                    <View
                        key={plan.key}
                        className={`relative rounded-lg bg-white dark:bg-slate-950 p-6 ${
                            isCurrent ? "border-2 border-teal-700" : plan.popular ? "border-2 border-slate-200 dark:border-slate-700" : "border border-slate-200 dark:border-slate-700"
                        }`}
                    >
                        {isCurrent ? (
                            <View className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-teal-200 bg-teal-50 dark:bg-teal-900 px-3 py-1">
                                <Text className="text-xs font-medium text-teal-800 dark:text-teal-100">Nykyinen paketti</Text>
                            </View>
                        ) : plan.popular && (
                            <View className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1">
                                <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">Suosituin</Text>
                            </View>
                        )}

                        <Text className="text-base font-medium text-slate-950 dark:text-slate-50">{plan.name}</Text>
                        <View className="mt-2 flex-row items-baseline gap-1">
                            <Text className="text-3xl font-semibold text-slate-950 dark:text-slate-50">{price}</Text>
                            <Text className="text-sm text-slate-500 dark:text-slate-400">/ kk</Text>
                        </View>
                        {isYearly && (
                            <Text className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Laskutetaan {plan.yearlyPrice} / vuosi
                            </Text>
                        )}
                        <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.description}</Text>

                        <View className="mt-4 gap-2">
                            {plan.features.map((feature) => (
                                <View key={feature} className="flex-row items-center gap-2">
                                    <Ionicons name="checkmark" size={16} color="#0f766e" />
                                    <Text className="flex-1 text-sm text-slate-500 dark:text-slate-400">{feature}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={() => handleChangePlan(planId)}
                            disabled={isCurrent || !!pendingPlanId}
                            className={`mt-4 h-10 flex-row items-center justify-center gap-2 rounded-md ${
                                isCurrent ? "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" : plan.popular ? "bg-teal-700" : "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950"
                            } ${pendingPlanId && !isPending ? "opacity-50" : ""}`}
                        >
                            {isPending && (
                                <ActivityIndicator size="small" color={plan.popular ? "#ffffff" : "#0f766e"} />
                            )}
                            <Text className={`text-sm font-medium ${
                                isCurrent ? "text-slate-400 dark:text-slate-500" : plan.popular ? "text-white" : "text-slate-700 dark:text-slate-200"
                            }`}>
                                {isPending ? "Vaihdetaan..." : isCurrent ? "Nykyinen paketti" : `Valitse ${plan.name}`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    );
};