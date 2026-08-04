import { Modal, View, Animated, Text, TouchableOpacity, ScrollView, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { UseAssistantScreenReturn } from "../../types/assistant"

export default function ChatHistory({ historyOpen, setHistoryOpen, 
    slideAnim, SIDEBAR_WIDTH, insets, 
    recentChats, handleNavigateToChat, backdropOpacity,
    handleNavigateToMain
}: UseAssistantScreenReturn) {
    return (
        <Modal
                visible={historyOpen}
                transparent
                animationType="none"
                onRequestClose={() => setHistoryOpen(false)}
            >
                <View className="flex-1 flex-row">
                    <Animated.View
                        style={{ width: SIDEBAR_WIDTH, transform: [{ translateX: slideAnim }] }}
                        className="h-full border-r border-slate-200 bg-white"
                    >
                        <View
                            style={{ paddingTop: insets.top + 12 }}
                            className="flex-row items-center justify-between border-b border-slate-200 px-4 pb-4"
                        >
                            <Text className="text-sm font-semibold text-slate-900">Keskustelut</Text>
                            <TouchableOpacity
                                onPress={() => setHistoryOpen(false)}
                                className="h-8 w-8 items-center justify-center rounded-lg"
                            >
                                <Ionicons name="close" size={18} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <View className="px-3 py-3">
                            <TouchableOpacity
                                onPress={handleNavigateToMain}
                                className="flex-row items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5"
                            >
                                <Ionicons name="add" size={16} color="#334155" />
                                <Text className="text-sm font-medium text-slate-600">Uusi keskustelu</Text>
                            </TouchableOpacity>
                        </View>

                        <Text className="px-5 pb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                            Viimeaikaiset
                        </Text>

                        <ScrollView className="flex-1 px-2">
                            {recentChats.map((chat, index) => (
                                <TouchableOpacity
                                    key={chat.id}
                                    onPress={() => handleNavigateToChat(chat.id)}
                                    className={`mb-1 flex-row items-center justify-between gap-2 rounded-xl px-3 py-2.5 ${
                                        index === 0 ? "bg-teal-50" : ""
                                    }`}
                                >
                                    <Text
                                        numberOfLines={1}
                                        className={`flex-1 text-sm font-medium ${index === 0 ? "text-teal-700" : "text-slate-700"}`}
                                    >
                                        {chat.title}
                                    </Text>
                                    <Text className="text-xs text-slate-400">{chat.date}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>

                    <Animated.View style={{ flex: 1, opacity: backdropOpacity }} className="bg-black">
                        <Pressable className="flex-1" onPress={() => setHistoryOpen(false)} />
                    </Animated.View>
                </View>
            </Modal>
    )
};