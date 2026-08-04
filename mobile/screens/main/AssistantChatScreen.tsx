import { KeyboardAvoidingView, Platform } from "react-native"
import { useAssistantScreen } from "../../hooks/useAssistantScreen"

import Header from "../../components/AI Assistant/Header"
import ChatHistory from "../../components/AI Assistant/ChatHistory"
import Input from "../../components/AI Assistant/Input"
import ChatMessages from "../../components/AI Assistant/ChatMessages"

export default function AssistantChatScreen({ navigation }: any) {
    const assistant = useAssistantScreen({ navigation });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1 bg-slate-50"
        >
            <Header {...assistant}/>
            <ChatHistory {...assistant}/>
            <ChatMessages {...assistant}/>
            <Input {...assistant}/>
        </KeyboardAvoidingView>
    )
}