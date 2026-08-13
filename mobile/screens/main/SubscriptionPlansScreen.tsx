import { View, ScrollView } from "react-native";
import Plans from "../../components/SubscriptionPlans/Plans";
import Toggelbutton from "../../components/SubscriptionPlans/Togglebutton";
import SubscriptionHeader from "../../components/SubscriptionPlans/SubscriptionHeader";
import { useSubscription } from "../../hooks/useSubscription";
import { useProfile } from "../../hooks/useProfile";
import { useNavigation } from "@react-navigation/native";

export default function SubscriptionPlansScreen() {
    const navigation = useNavigation<any>();
    const { subscription } = useProfile({ navigation });
    const { isYearly, setIsYearly, handleChangePlan, selectedPlan, pendingPlanId } = useSubscription(subscription?.subscription_type);

    return (
        <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <SubscriptionHeader />
            <View className="gap-6 px-4 py-6">
                <Toggelbutton isYearly={isYearly} setIsYearly={setIsYearly}/>
                <Plans
                    isYearly={isYearly}
                    selectedPlan={selectedPlan}
                    pendingPlanId={pendingPlanId}
                    handleChangePlan={handleChangePlan}
                />
            </View>
        </ScrollView>
    );
};