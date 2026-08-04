import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import { useEffect, useRef } from "react"
import { UseAssistantScreenReturn } from "../../types/assistant"
import { Message } from "../../types/assistant"

export default function ChatMessages({ messages, isChatLoading }: UseAssistantScreenReturn) {
    const lastMessage = messages[messages.length - 1];
    const isWaiting = !lastMessage || lastMessage.role === "USER" || (lastMessage.role === "ASSISTANT" && lastMessage.content.length === 0);
    const visibleMessages = messages.filter((msg) => !(msg.role === "ASSISTANT" && msg.content.length === 0));

    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    if (isChatLoading) {
        return (
            <View className="flex-1 items-center justify-center gap-3">
                <ActivityIndicator size="small" color="#0d9488" />
                <Text className="text-sm text-slate-400">Ladataan keskustelua...</Text>
            </View>
        )
    }

    return (
        <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            className="flex-1"
            contentContainerClassName="gap-4 px-4 py-6"
        >
            {visibleMessages.map((msg: Message) => {
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

            {isWaiting && (
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
            )}
        </ScrollView>
    )
};