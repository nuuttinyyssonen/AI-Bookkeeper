import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { UseProfileReturn } from "../../types/profile";

export default function ProfileInformation({isEditingInformation, information, setInformation, 
    setIsEditingInformation, handleCancelInformation}: UseProfileReturn) {
    return (
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
    );
};