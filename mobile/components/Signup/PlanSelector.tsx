import { View, Text, TouchableOpacity } from "react-native"
import { Plan } from "../../types/auth";

interface PlanSelectorProps {
    selectedPlan: Plan;
    onSelect: (plan: Plan) => void;
}

const plans: {
    id: Plan;
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    badge?: string;
}[] = [
    {
        id: "BASIC",
        name: "Basic",
        price: "€19.99",
        period: "/ kk",
        description: "Yksityishenkilöille ja freelancereille",
        features: ["Rajattomat kuitit", "AI-kirjanpitäjä", "Kuukausiraportit"],
    },
    {
        id: "PREMIUM",
        name: "Premium",
        price: "€39.99",
        period: "/ kk",
        description: "Pienyrityksille",
        features: ["Kaikki Basic-paketista", "Prioriteettituki", "Edistynyt analytiikka"],
        badge: "Suosituin",
    },
];

export default function PlanSelector({ selectedPlan, onSelect }: PlanSelectorProps) {
    return (
        <View className="gap-3">
            <Text className="text-sm text-slate-500">Valitse tilaus</Text>
            {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                    <TouchableOpacity
                        key={plan.id}
                        onPress={() => onSelect(plan.id)}
                        className={`rounded-lg border p-4 ${
                            isSelected ? "border-teal-700 border-2" : "border-slate-300"
                        }`}
                    >
                        <View className="mb-2 flex-row items-start justify-between">
                            <View>
                                <Text className="text-sm font-medium text-slate-950">{plan.name}</Text>
                                {plan.badge && (
                                    <Text className="mt-1 self-start rounded bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800">
                                        {plan.badge}
                                    </Text>
                                )}
                            </View>
                            <View
                                className={`h-4 w-4 items-center justify-center rounded-full border ${
                                    isSelected ? "border-teal-700 bg-teal-700" : "border-slate-300"
                                }`}
                            >
                                {isSelected && <View className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </View>
                        </View>

                        <View className="mb-1 mt-2 flex-row items-baseline">
                            <Text className="text-lg font-medium text-slate-950">{plan.price}</Text>
                            <Text className="ml-1 text-xs text-slate-500">{plan.period}</Text>
                        </View>

                        <Text className="mb-3 text-xs text-slate-500">{plan.description}</Text>

                        <View className="gap-1.5">
                            {plan.features.map((feature) => (
                                <View key={feature} className="flex-row items-center gap-2">
                                    <Text className="text-xs font-medium text-teal-700">✓</Text>
                                    <Text className="text-xs text-slate-500">{feature}</Text>
                                </View>
                            ))}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
