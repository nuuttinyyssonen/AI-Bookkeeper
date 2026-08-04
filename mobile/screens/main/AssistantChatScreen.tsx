import { useEffect, useRef, useState } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Pressable, Animated, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const SIDEBAR_WIDTH = Math.min(300, Dimensions.get("window").width * 0.8)

const recentChats = [
    { id: "1", title: "Kuittien luokittelu", date: "3.8." },
    { id: "2", title: "Alv-vähennykset", date: "1.8." },
    { id: "3", title: "Kassavirtaraportti", date: "28.7." },
]

const messages = [
    { id: 1, role: "AI", content: "Hei Nuutti! Miten voin auttaa kirjanpidossasi tänään?" },
    { id: 2, role: "USER", content: "Paljonko olen käyttänyt ravintolakuluihin tässä kuussa?" },
    { id: 3, role: "AI", content: "Elokuussa ravintolakuluja on kirjattu yhteensä 214,50 €, yhteensä 6 kuitilta. Haluatko näkymän eriteltynä kuitti kerrallaan?" },
]

export default function AssistantChatScreen({ navigation }: any) {
    const insets = useSafeAreaInsets()
    const [input, setInput] = useState("")
    const [historyOpen, setHistoryOpen] = useState(false)
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: historyOpen ? 0 : -SIDEBAR_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start()
    }, [historyOpen])

    const backdropOpacity = slideAnim.interpolate({
        inputRange: [-SIDEBAR_WIDTH, 0],
        outputRange: [0, 0.4],
    });

    const handleNavigateToMain = () => {
        navigation.goBack();
        setHistoryOpen(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1 bg-slate-50"
        >
            <View className="flex-row items-center justify-between border-b border-slate-200 bg-white px-4 py-4">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        onPress={() => setHistoryOpen(true)}
                        className="h-9 w-9 items-center justify-center rounded-lg"
                    >
                        <Ionicons name="menu" size={20} color="#334155" />
                    </TouchableOpacity>
                    <View className="h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
                        <Ionicons name="sparkles" size={18} color="white" />
                    </View>
                    <View>
                        <Text className="text-base font-semibold text-slate-900">AI-avustaja</Text>
                        <Text className="text-xs text-slate-500">Kysy kirjanpidosta, kuiteista tai raporteista</Text>
                    </View>
                </View>
                <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-lg border border-slate-200">
                    <Ionicons name="add" size={18} color="#334155" />
                </TouchableOpacity>
            </View>

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
                                    onPress={() => setHistoryOpen(false)}
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

            <ScrollView className="flex-1" contentContainerClassName="gap-4 px-4 py-6">
                {messages.map((msg) => {
                    const isUser = msg.role === "USER"
                    return (
                        <View key={msg.id} className={`flex-row items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                            {!isUser && (
                                <View className="h-8 w-8 items-center justify-center rounded-full bg-teal-600">
                                    <Text className="text-xs font-semibold text-white">AI</Text>
                                </View>
                            )}
                            <View
                                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                                    isUser
                                        ? "rounded-br-sm bg-slate-900"
                                        : "rounded-bl-sm border border-slate-200 bg-white shadow-sm"
                                }`}
                            >
                                <Text className={`text-sm leading-5 ${isUser ? "text-white" : "text-slate-800"}`}>
                                    {msg.content}
                                </Text>
                            </View>
                            {isUser && (
                                <View className="h-8 w-8 items-center justify-center rounded-full bg-slate-900">
                                    <Text className="text-xs font-semibold text-white">N</Text>
                                </View>
                            )}
                        </View>
                    )
                })}

                <View className="flex-row items-end gap-2">
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-teal-600">
                        <Text className="text-xs font-semibold text-white">AI</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <View className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <View className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <View className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    </View>
                </View>
            </ScrollView>

            <View className="border-t border-slate-200 bg-white px-4 py-4">
                <View className="flex-row items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder="Kirjoita viesti..."
                        placeholderTextColor="#94a3b8"
                        multiline
                        className="flex-1 py-2 text-sm text-slate-900"
                    />
                    <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-xl bg-teal-600">
                        <Ionicons name="arrow-up" size={16} color="white" />
                    </TouchableOpacity>
                </View>
                <Text className="mt-2 text-center text-xs text-slate-400">
                    AI-avustaja voi tehdä virheitä. Tarkista tärkeät tiedot.
                </Text>
            </View>
        </KeyboardAvoidingView>
    )
}
