import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { UseProfileReturn } from "../../types/profile";

export default function ProfileInformation({isEditingInformation, information, setInformation, 
    setIsEditingInformation, handleCancelInformation, handleUpdateInformation}: UseProfileReturn) {
    return (
        <View className="gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
            <Text className="text-sm font-semibold text-slate-950 dark:text-slate-50">Perustiedot</Text>

            <View className="gap-4">
                <View className="gap-1">
                    <Text className="text-xs text-slate-500 dark:text-slate-400">Etunimi</Text>
                    {isEditingInformation ? (
                        <TextInput
                            value={information.firstName}
                            onChangeText={(value) => setInformation((prev) => ({ ...prev, firstName: value }))}
                            className="h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 text-sm text-slate-950 dark:text-slate-50"
                        />
                    ) : (
                        <Text className="text-sm font-medium text-slate-950 dark:text-slate-50">{information.firstName}</Text>
                    )}
                </View>
                <View className="gap-1">
                    <Text className="text-xs text-slate-500 dark:text-slate-400">Sukunimi</Text>
                    {isEditingInformation ? (
                        <TextInput
                            value={information.lastName}
                            onChangeText={(value) => setInformation((prev) => ({ ...prev, lastName: value }))}
                            className="h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 text-sm text-slate-950 dark:text-slate-50"
                        />
                    ) : (
                        <Text className="text-sm font-medium text-slate-950 dark:text-slate-50">{information.lastName}</Text>
                    )}
                </View>
                <View className="gap-1">
                    <Text className="text-xs text-slate-500 dark:text-slate-400">Sähköposti</Text>
                    {isEditingInformation ? (
                        <TextInput
                            value={information.email}
                            onChangeText={(value) => setInformation((prev) => ({ ...prev, email: value }))}
                            className="h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 text-sm text-slate-950 dark:text-slate-50"
                        />
                    ) : (
                        <Text className="text-sm font-medium text-slate-950 dark:text-slate-50">{information.email}</Text>
                    )}
                </View>
                <View className="gap-1">
                    <Text className="text-xs text-slate-500 dark:text-slate-400">Puhelinnumero</Text>
                    {isEditingInformation ? (
                        <TextInput
                            value={information.phoneNumber}
                            onChangeText={(value) => setInformation((prev) => ({ ...prev, phoneNumber: value }))}
                            className="h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 text-sm text-slate-950 dark:text-slate-50"
                        />
                    ) : (
                        <Text className="text-sm font-medium text-slate-950 dark:text-slate-50">{information.phoneNumber}</Text>
                    )}
                </View>
                <View className="gap-1">
                    <Text className="text-xs text-slate-500 dark:text-slate-400">Y-tunnus</Text>
                    {isEditingInformation ? (
                        <TextInput
                            value={information.businessId}
                            onChangeText={(value) => setInformation((prev) => ({ ...prev, businessId: value }))}
                            className="h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 text-sm text-slate-950 dark:text-slate-50"
                        />
                    ) : (
                        <Text className="text-sm font-medium text-slate-950 dark:text-slate-50">{information.businessId}</Text>
                    )}
                </View>
            </View>

            {isEditingInformation ? (
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        onPress={handleUpdateInformation}
                        className="h-9 items-center justify-center rounded-md bg-teal-700 px-4"
                    >
                        <Text className="text-sm font-medium text-white">Tallenna</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleCancelInformation}
                        className="h-9 items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-4"
                    >
                        <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">Peruuta</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={() => setIsEditingInformation(true)}
                    className="h-9 items-center justify-center self-start rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-4"
                >
                    <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">Muokkaa tietoja</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};