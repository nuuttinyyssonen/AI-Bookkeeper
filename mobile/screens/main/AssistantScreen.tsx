import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Pressable, Animated, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAssistantScreen } from "../../hooks/useAssistantScreen"

import Header from "../../components/AI Assistant/Header"
import ChatHistory from "../../components/AI Assistant/ChatHistory"
import Input from "../../components/AI Assistant/Input"
import Start from "../../components/AI Assistant/Start"

export default function AssistantScreen({ navigation }: any) {
    const assistant = useAssistantScreen({ navigation });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1 bg-slate-50"
        >
            <Header {...assistant}/>
            <ChatHistory {...assistant}/>
            <Start {...assistant}/>
            <Input {...assistant}/>
        </KeyboardAvoidingView>
    )
}
