import { View, Text, TouchableOpacity } from "react-native"

export default function ProfileSubscription() {
    return (
        <View className="gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Text className="text-sm font-semibold text-slate-950">Tilaus</Text>

            <View className="gap-4">
                <View className="gap-1">
                    <Text className="text-xs text-slate-500">Nykyinen paketti</Text>
                    <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-medium text-slate-950">PREMIUM</Text>
                        <View className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5">
                            <Text className="text-xs font-medium text-teal-800">Aktiivinen</Text>
                        </View>
                    </View>
                </View>
                <View className="gap-1">
                    <Text className="text-xs text-slate-500">Nykyinen jakso alkoi</Text>
                    <Text className="text-sm font-medium text-slate-950">1.7.2026</Text>
                </View>
                <View className="gap-1">
                    <Text className="text-xs text-slate-500">Seuraava laskutuspäivä</Text>
                    <Text className="text-sm font-medium text-slate-950">1.8.2026</Text>
                </View>
            </View>

            <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity className="h-9 items-center justify-center rounded-md bg-teal-700 px-4">
                    <Text className="text-sm font-medium text-white">Vaihda pakettia</Text>
                </TouchableOpacity>
                <TouchableOpacity className="h-9 items-center justify-center rounded-md border border-red-300 bg-white px-4">
                    <Text className="text-sm font-medium text-red-600">Peruuta tilaus</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};