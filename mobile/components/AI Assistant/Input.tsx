import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { UseAssistantScreenReturn } from "../../types/assistant"

export default function Input({ input, setInput, handleSend, handleNewChat, isCreatingChat, id }: UseAssistantScreenReturn & { id?: string }) {

    return (
        <View className="border-t border-slate-200 bg-white px-4 py-4">
            <View className="flex-row items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Kirjoita viesti..."
                    placeholderTextColor="#94a3b8"
                    multiline
                    editable={!isCreatingChat}
                    className="flex-1 py-2 text-sm text-slate-900"
                />
                <TouchableOpacity
                    disabled={isCreatingChat}
                    onPress={() => {
                        if (id) {
                            handleSend(input, id);
                        } else {
                            handleNewChat(input);
                        }
                    }}
                    className={`h-8 w-8 items-center justify-center rounded-xl bg-teal-600 ${isCreatingChat ? "opacity-60" : ""}`}
                >
                    {isCreatingChat ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons name="arrow-up" size={16} color="white" />
                    )}
                </TouchableOpacity>
            </View>
            <Text className="mt-2 text-center text-xs text-slate-400">
                AI-avustaja voi tehdä virheitä. Tarkista tärkeät tiedot.
            </Text>
        </View>
    )
};