import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native"
import { useState } from "react"

const initialInformation = {
    firstName: "Matti",
    lastName: "Meikäläinen",
    email: "matti.meikalainen@example.com",
    phoneNumber: "+358 40 123 4567",
    businessId: "1234567-8",
}

export default function ProfileScreen() {
    const [isEditingInformation, setIsEditingInformation] = useState(false)
    const [information, setInformation] = useState(initialInformation)

    const handleCancelInformation = () => {
        setInformation(initialInformation)
        setIsEditingInformation(false)
    }

    return (
        <ScrollView className="flex-1 bg-slate-50">
            <View className="border-b border-slate-200 bg-white px-4 py-4">
                <Text className="text-sm font-medium text-teal-700">Profiili</Text>
                <Text className="mt-1 text-2xl font-semibold text-slate-950">Tili ja asetukset</Text>
            </View>

            <View className="gap-4 px-4 py-6">
                {/* Perustiedot */}
                <View className="gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <Text className="text-sm font-semibold text-slate-950">Perustiedot</Text>

                    <View className="gap-4">
                        <View className="gap-1">
                            <Text className="text-xs text-slate-500">Etunimi</Text>
                            {isEditingInformation ? (
                                <TextInput
                                    value={information.firstName}
                                    onChangeText={(value) => setInformation((prev) => ({ ...prev, firstName: value }))}
                                    className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950"
                                />
                            ) : (
                                <Text className="text-sm font-medium text-slate-950">{information.firstName}</Text>
                            )}
                        </View>
                        <View className="gap-1">
                            <Text className="text-xs text-slate-500">Sukunimi</Text>
                            {isEditingInformation ? (
                                <TextInput
                                    value={information.lastName}
                                    onChangeText={(value) => setInformation((prev) => ({ ...prev, lastName: value }))}
                                    className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950"
                                />
                            ) : (
                                <Text className="text-sm font-medium text-slate-950">{information.lastName}</Text>
                            )}
                        </View>
                        <View className="gap-1">
                            <Text className="text-xs text-slate-500">Sähköposti</Text>
                            {isEditingInformation ? (
                                <TextInput
                                    value={information.email}
                                    onChangeText={(value) => setInformation((prev) => ({ ...prev, email: value }))}
                                    className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950"
                                />
                            ) : (
                                <Text className="text-sm font-medium text-slate-950">{information.email}</Text>
                            )}
                        </View>
                        <View className="gap-1">
                            <Text className="text-xs text-slate-500">Puhelinnumero</Text>
                            {isEditingInformation ? (
                                <TextInput
                                    value={information.phoneNumber}
                                    onChangeText={(value) => setInformation((prev) => ({ ...prev, phoneNumber: value }))}
                                    className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950"
                                />
                            ) : (
                                <Text className="text-sm font-medium text-slate-950">{information.phoneNumber}</Text>
                            )}
                        </View>
                        <View className="gap-1">
                            <Text className="text-xs text-slate-500">Y-tunnus</Text>
                            {isEditingInformation ? (
                                <TextInput
                                    value={information.businessId}
                                    onChangeText={(value) => setInformation((prev) => ({ ...prev, businessId: value }))}
                                    className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950"
                                />
                            ) : (
                                <Text className="text-sm font-medium text-slate-950">{information.businessId}</Text>
                            )}
                        </View>
                    </View>

                    {isEditingInformation ? (
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={() => setIsEditingInformation(false)}
                                className="h-9 items-center justify-center rounded-md bg-teal-700 px-4"
                            >
                                <Text className="text-sm font-medium text-white">Tallenna</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCancelInformation}
                                className="h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-4"
                            >
                                <Text className="text-sm font-medium text-slate-700">Peruuta</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setIsEditingInformation(true)}
                            className="h-9 items-center justify-center self-start rounded-md border border-slate-300 bg-white px-4"
                        >
                            <Text className="text-sm font-medium text-slate-700">Muokkaa tietoja</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Tilaus */}
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

                {/* Maksuhistoria */}
                <View className="gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <Text className="text-sm font-semibold text-slate-950">Maksuhistoria</Text>

                    <View className="divide-y divide-slate-100">
                        <View className="flex-row items-center justify-between py-3">
                            <View>
                                <Text className="text-sm font-medium text-slate-950">Premium-tilaus</Text>
                                <Text className="text-xs text-slate-500">1.7.2026</Text>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5">
                                    <Text className="text-xs font-medium text-teal-800">Maksettu</Text>
                                </View>
                                <Text className="text-sm font-medium text-slate-950">29,00 €</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center justify-between py-3">
                            <View>
                                <Text className="text-sm font-medium text-slate-950">Premium-tilaus</Text>
                                <Text className="text-xs text-slate-500">1.6.2026</Text>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5">
                                    <Text className="text-xs font-medium text-teal-800">Maksettu</Text>
                                </View>
                                <Text className="text-sm font-medium text-slate-950">29,00 €</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Vaaravyöhyke */}
                <View className="gap-3 rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
                    <Text className="text-sm font-semibold text-slate-950">Vaaravyöhyke</Text>
                    <Text className="text-sm text-slate-500">
                        Tilin poistaminen on pysyvä toimenpide eikä sitä voi peruuttaa.
                    </Text>

                    <Text className="text-sm text-slate-700">
                        Kirjoita <Text className="font-mono font-semibold">DELETE</Text> vahvistaaksesi tilin poistaminen
                    </Text>
                    <TextInput
                        placeholder="DELETE"
                        placeholderTextColor="#94a3b8"
                        className="h-9 w-full max-w-xs rounded-md border border-slate-200 px-3 text-sm text-slate-950"
                    />

                    <TouchableOpacity className="h-9 items-center justify-center self-start rounded-md bg-red-600 px-4">
                        <Text className="text-sm font-medium text-white">Poista tili</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity className="items-center py-2">
                    <Text className="text-sm text-slate-500 underline">Takaisin hallintapaneeliin</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
