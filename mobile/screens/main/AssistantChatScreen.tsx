import { KeyboardAvoidingView, Platform } from "react-native"
import { useAssistantScreen } from "../../hooks/useAssistantScreen"
import { useEffect } from "react"

import Header from "../../components/AI Assistant/Header"
import ChatHistory from "../../components/AI Assistant/ChatHistory"
import Input from "../../components/AI Assistant/Input"
import ChatMessages from "../../components/AI Assistant/ChatMessages"

export default function AssistantChatScreen({ navigation, route }: any) {
    const assistant = useAssistantScreen({ navigation });
    const { id, firstMessage } = route.params;

    useEffect(() => {
        if (!id) return;
        if (firstMessage) {
            assistant.handleSend(firstMessage, id);
        } else {
            assistant.fetchChatMessages(id);
        }
    }, [id]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1 bg-slate-50"
        >
            <Header {...assistant}/>
            <ChatHistory {...assistant}/>
            <ChatMessages {...assistant}/>
            <Input {...assistant} id={id}/>
        </KeyboardAvoidingView>
    )
}