import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native"
import { useProfile } from "../../hooks/useProfile"

import ProfileInformation from "../../components/Profile/ProfileInformation";
import ProfileSubscription from "../../components/Profile/ProfileSubscription";
import ProfilePaymentHistory from "../../components/Profile/ProfilePaymentHistory";
import ProfileDeletion from "../../components/Profile/ProfileDeletion";
import ProfileAppearance from "../../components/Profile/ProfileAppearance";

export default function ProfileScreen({ navigation }: any) {
    const profile = useProfile({ navigation });

    if (profile.isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Text className="text-sm text-slate-500 dark:text-slate-400">Ladataan...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <View className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4">
                <Text className="text-sm font-medium text-teal-700 dark:text-teal-400">Profiili</Text>
                <Text className="mt-1 text-2xl font-semibold text-slate-950 dark:text-slate-50">Tili ja asetukset</Text>
            </View>
            <View className="gap-4 px-4 py-6">
                <ProfileInformation {...profile}/>
                <ProfileAppearance />
                <ProfileSubscription {...profile}/>
                <ProfilePaymentHistory {...profile}/>
                <ProfileDeletion {...profile}/>
                <TouchableOpacity className="items-center py-2">
                    <Text className="text-sm text-slate-500 dark:text-slate-400 underline">Takaisin hallintapaneeliin</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
