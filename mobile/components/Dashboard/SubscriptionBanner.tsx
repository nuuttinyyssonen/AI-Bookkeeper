import { View, Text } from "react-native"
import { UseDashboardReturn } from "../../types/dashboard"
import { useNavigation } from "@react-navigation/native"

export default function SubscriptionBanner({ subscriptionType }: UseDashboardReturn) {
    const navigation = useNavigation<any>();
    return (
        <View className="flex-row items-center justify-between rounded-lg border border-teal-200 bg-teal-50 dark:bg-teal-900 px-4 py-3">
            {subscriptionType ? (
                <>
                    <Text className="flex-1 text-sm text-teal-800 dark:text-teal-100">Olen {subscriptionType} paketissa</Text>
                    <Text onPress={() => navigation.navigate("SubscriptionPlans")} className="text-sm font-medium text-teal-800 dark:text-teal-100 underline">
                        {subscriptionType === "BASIC" ? "Päivitä Premiumiin" : "Selaa paketteja"}
                    </Text>
                </>
            ) : (
                <>
                    <Text className="text-sm text-teal-800 dark:text-teal-100">Tilaus ei ole aktiivinen</Text>
                    <Text onPress={() => navigation.navigate("SubscriptionPlans")} className="text-sm font-medium text-teal-800 dark:text-teal-100 underline">
                        Selaa paketteja
                    </Text>
                </>
            )}
        </View>
    ) 
};