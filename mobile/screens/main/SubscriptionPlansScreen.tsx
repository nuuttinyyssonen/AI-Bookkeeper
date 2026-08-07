import { useState } from "react";
import { View, ScrollView } from "react-native";
import Plans from "../../components/SubscriptionPlans/Plans";
import Toggelbutton from "../../components/SubscriptionPlans/Togglebutton";
import SubscriptionHeader from "../../components/SubscriptionPlans/SubscriptionHeader";

export default function SubscriptionPlansScreen() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <ScrollView className="flex-1 bg-slate-50">
            <SubscriptionHeader />
            <View className="gap-6 px-4 py-6">
                <Toggelbutton isYearly={isYearly} setIsYearly={setIsYearly}/>
                <Plans isYearly={isYearly}/>
            </View>
        </ScrollView>
    );
};