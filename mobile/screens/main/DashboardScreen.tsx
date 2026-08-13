import { View, ScrollView } from "react-native"
import { useDashboard } from "../../hooks/useDashboard"

import Header from "../../components/Dashboard/Header";
import SubscriptionBanner from "../../components/Dashboard/SubscriptionBanner";
import Summary from "../../components/Dashboard/Summary";
import Cashflow from "../../components/Dashboard/Cashflow";
import RecentReceipts from "../../components/Dashboard/RecentReceipts";

export default function DashboardScreen() {
    const dashboard = useDashboard();

    return(
        <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <Header {...dashboard}/>
            <View className="gap-6 px-4 py-6">
                <SubscriptionBanner {...dashboard}/>
                <Summary {...dashboard}/>
                <Cashflow {...dashboard}/>
                <RecentReceipts {...dashboard}/>
            </View>
        </ScrollView>
    )
};