import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { UseProfileReturn } from "../../types/profile";
import { useNavigation } from "@react-navigation/native";

export default function ProfileSubscription({
    subscription,
    isConfirmingCancelSubscription,
    setIsConfirmingCancelSubscription,
    isCancellingSubscription,
    handleCancelSubscription,
    isConfirmingReactivateSubscription,
    setIsConfirmingReactivateSubscription,
    isReactivatingSubscription,
    handleReactivateSubscription
}: UseProfileReturn) {
    const periodStart = subscription?.current_period_start
        ? new Date(subscription.current_period_start).toLocaleDateString("fi-FI")
        : null;

    const periodEnd = subscription?.current_period_end
        ? new Date(subscription.current_period_end).toLocaleDateString("fi-FI")
        : null;

    const isCancelledAtPeriodEnd = subscription?.cancel_at_period_end;
    const isCancelled = subscription?.subscription_status === "CANCELLED";
    const showAccessUntil = isCancelledAtPeriodEnd || isCancelled;

    const navigation = useNavigation<any>();

    return (
        <View className="gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
            <Text className="text-sm font-semibold text-slate-950 dark:text-slate-50">Tilaus</Text>

            <View className="gap-4">
                <View className="gap-1">
                    <Text className="text-xs text-slate-500 dark:text-slate-400">Nykyinen paketti</Text>
                    <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-medium text-slate-950 dark:text-slate-50">
                            {subscription?.subscription_type ?? "—"}
                        </Text>
                        {isCancelledAtPeriodEnd ? (
                            <View className="rounded-full border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900 px-2 py-0.5">
                                <Text className="text-xs font-medium text-amber-800 dark:text-amber-100">Päättyy {periodEnd ?? ""}</Text>
                            </View>
                        ) : subscription?.subscription_status === "ACTIVE" ? (
                            <View className="rounded-full border border-teal-200 bg-teal-50 dark:bg-teal-900 px-2 py-0.5">
                                <Text className="text-xs font-medium text-teal-800 dark:text-teal-100">Aktiivinen</Text>
                            </View>
                        ) : isCancelled ? (
                            <View className="rounded-full border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900 px-2 py-0.5">
                                <Text className="text-xs font-medium text-amber-800 dark:text-amber-100">Peruutettu</Text>
                            </View>
                        ) : subscription?.subscription_status === "PAST_DUE" ? (
                            <View className="rounded-full border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900 px-2 py-0.5">
                                <Text className="text-xs font-medium text-red-800 dark:text-red-100">Maksu myöhässä</Text>
                            </View>
                        ) : null}
                    </View>
                </View>
                <View className="gap-1">
                    <Text className="text-xs text-slate-500 dark:text-slate-400">Nykyinen jakso alkoi</Text>
                    <Text className="text-sm font-medium text-slate-950 dark:text-slate-50">{periodStart ?? "—"}</Text>
                </View>
                <View className="gap-1">
                    <Text className="text-xs text-slate-500 dark:text-slate-400">
                        {showAccessUntil ? "Käyttöoikeus voimassa" : "Seuraava laskutuspäivä"}
                    </Text>
                    <Text className="text-sm font-medium text-slate-950 dark:text-slate-50">{periodEnd ?? "—"}</Text>
                </View>
            </View>

            {isConfirmingCancelSubscription ? (
                <View className="gap-2 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900 p-3">
                    <Text className="text-xs text-red-800 dark:text-red-100">
                        Tilauksesi peruutetaan nykyisen laskutuskauden lopussa. Käyttöoikeutesi säilyy siihen asti.
                    </Text>
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={handleCancelSubscription}
                            disabled={isCancellingSubscription}
                            className="h-8 flex-1 flex-row items-center justify-center gap-2 rounded-md bg-red-600 dark:bg-red-700 px-4 disabled:opacity-60"
                        >
                            {isCancellingSubscription && <ActivityIndicator size="small" color="white" />}
                            <Text className="text-xs font-medium text-white">
                                {isCancellingSubscription ? "Peruutetaan..." : "Vahvista peruutus"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setIsConfirmingCancelSubscription(false)}
                            disabled={isCancellingSubscription}
                            className="h-8 flex-1 items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-4 disabled:opacity-60"
                        >
                            <Text className="text-xs font-medium text-slate-700 dark:text-slate-200">Säilytä tilaus</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : isConfirmingReactivateSubscription ? (
                <View className="gap-2 rounded-lg border border-teal-200 bg-teal-50 dark:bg-teal-900 p-3">
                    <Text className="text-xs text-teal-800 dark:text-teal-100">
                        Tilauksesi aktivoidaan uudelleen ja sinua laskutetaan edelleen nykyisen kauden lopussa.
                    </Text>
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={handleReactivateSubscription}
                            disabled={isReactivatingSubscription}
                            className="h-8 flex-1 flex-row items-center justify-center gap-2 rounded-md bg-teal-700 px-4 disabled:opacity-60"
                        >
                            {isReactivatingSubscription && <ActivityIndicator size="small" color="white" />}
                            <Text className="text-xs font-medium text-white">
                                {isReactivatingSubscription ? "Aktivoidaan..." : "Vahvista uudelleenaktivointi"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setIsConfirmingReactivateSubscription(false)}
                            disabled={isReactivatingSubscription}
                            className="h-8 flex-1 items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-4 disabled:opacity-60"
                        >
                            <Text className="text-xs font-medium text-slate-700 dark:text-slate-200">Peruuta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View className="flex-row flex-wrap gap-2">
                    <TouchableOpacity onPress={() => navigation.navigate("SubscriptionPlans")} className="h-9 items-center justify-center rounded-md bg-teal-700 px-4">
                        <Text className="text-sm font-medium text-white">Vaihda pakettia</Text>
                    </TouchableOpacity>
                    {isCancelledAtPeriodEnd || isCancelled ? (
                        <TouchableOpacity
                            onPress={() => setIsConfirmingReactivateSubscription(true)}
                            className="h-9 items-center justify-center rounded-md border border-teal-300 bg-white dark:bg-slate-950 px-4"
                        >
                            <Text className="text-sm font-medium text-teal-700 dark:text-teal-200">Aktivoi tilaus uudelleen</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setIsConfirmingCancelSubscription(true)}
                            className="h-9 items-center justify-center rounded-md border border-red-300 dark:border-red-600 bg-white dark:bg-slate-950 px-4"
                        >
                            <Text className="text-sm font-medium text-red-600 dark:text-red-300">Peruuta tilaus</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};
