import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native"
import { useProfile } from "../../hooks/useProfile"

import ProfileInformation from "../../components/Profile/ProfileInformation";
import ProfileSubscription from "../../components/Profile/ProfileSubscription";
import ProfilePaymentHistory from "../../components/Profile/ProfilePaymentHistory";
import ProfileDeletion from "../../components/Profile/ProfileDeletion";

export default function ProfileScreen() {
    const profile = useProfile();

    if (profile.isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <Text className="text-sm text-slate-500">Ladataan...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-slate-50">
            <View className="border-b border-slate-200 bg-white px-4 py-4">
                <Text className="text-sm font-medium text-teal-700">Profiili</Text>
                <Text className="mt-1 text-2xl font-semibold text-slate-950">Tili ja asetukset</Text>
            </View>
            <View className="gap-4 px-4 py-6">
                <ProfileInformation {...profile}/>
                <ProfileSubscription />
                <ProfilePaymentHistory />
                <ProfileDeletion />
                <TouchableOpacity className="items-center py-2">
                    <Text className="text-sm text-slate-500 underline">Takaisin hallintapaneeliin</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
