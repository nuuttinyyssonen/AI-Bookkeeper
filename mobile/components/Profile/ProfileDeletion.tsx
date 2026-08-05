import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { UseProfileReturn } from "../../types/profile";

export default function ProfileDeletion({ handleDeleteUser, confirmationInput, setConfirmationInput, isDeletingUser }: UseProfileReturn) {
    return (
        <View className="gap-3 rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
            <Text className="text-sm font-semibold text-slate-950">Vaaravyöhyke</Text>
            <Text className="text-sm text-slate-500">
                Tilin poistaminen on pysyvä toimenpide eikä sitä voi peruuttaa.
            </Text>

            <Text className="text-sm text-slate-700">
                Kirjoita <Text className="font-mono font-semibold">DELETE</Text> vahvistaaksesi tilin poistaminen
            </Text>
            <TextInput
                value={confirmationInput}
                onChangeText={setConfirmationInput}
                editable={!isDeletingUser}
                placeholder="DELETE"
                placeholderTextColor="#94a3b8"
                className="h-9 w-full max-w-xs rounded-md border border-slate-200 px-3 text-sm text-slate-950"
            />

            <TouchableOpacity
                onPress={handleDeleteUser}
                disabled={isDeletingUser}
                className="h-9 flex-row items-center justify-center gap-2 self-start rounded-md bg-red-600 px-4 disabled:opacity-60"
            >
                {isDeletingUser && <ActivityIndicator size="small" color="white" />}
                <Text className="text-sm font-medium text-white">
                    {isDeletingUser ? "Poistetaan..." : "Poista tili"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};