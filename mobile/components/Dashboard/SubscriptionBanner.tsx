import { View, Text } from "react-native"
import { UseDashboardReturn } from "../../types/dashboard"

export default function SubscriptionBanner({ subscriptionType }: UseDashboardReturn) {
    return (
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
    ) 
};