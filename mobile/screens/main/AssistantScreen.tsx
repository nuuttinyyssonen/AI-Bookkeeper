import { KeyboardAvoidingView, Platform } from "react-native"
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
            className="flex-1 bg-slate-50 dark:bg-slate-900"
        >
            <Header {...assistant}/>
            <ChatHistory {...assistant}/>
            <Start {...assistant}/>
            <Input {...assistant}/>
        </KeyboardAvoidingView>
    )
}
