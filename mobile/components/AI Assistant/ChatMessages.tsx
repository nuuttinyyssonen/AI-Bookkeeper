import { ScrollView, Text, View } from "react-native"
import { UseAssistantScreenReturn } from "../../types/assistant"
import { Message } from "../../types/assistant"

export default function ChatMessages({ messages }: UseAssistantScreenReturn) {
    return (
        <ScrollView className="flex-1" contentContainerClassName="gap-4 px-4 py-6">
            {messages.map((msg: Message) => {
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
    )
};