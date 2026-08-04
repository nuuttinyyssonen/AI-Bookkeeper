import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { Dimensions, Animated, Alert } from "react-native";
import { UseAssistantScreenReturn } from "../types/assistant";
import { Message } from "../types/assistant";
import api from "../services/api";
import * as SecureStore from "expo-secure-store";

export const useAssistantScreen = ({ navigation }: any): UseAssistantScreenReturn => {
    const SIDEBAR_WIDTH = Math.min(300, Dimensions.get("window").width * 0.8)

    const [input, setInput] = useState("")
    const [historyOpen, setHistoryOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([]);
    const [recentChats, setRecentChats] = useState([]);

    const insets = useSafeAreaInsets()
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current

    const handleSend = async (message: string, id: string) => {
        setInput("");
        setMessages(prev => [...prev, { id: Date.now(), role: "USER", content: message }]);

        const token = await SecureStore.getItemAsync("token");

        const response = await fetch(`http://localhost:5001/api/assistant/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message }),
        });

        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        const assistantId = Date.now() + 1;
        setMessages(prev => [...prev, { id: assistantId, role: "ASSISTANT", content: "" }]);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n\n").filter(Boolean);

            for (const line of lines) {
                const data = line.replace("data: ", "");
                if (data === "[DONE]") break;
                const { text } = JSON.parse(data);
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantId
                        ? { ...msg, content: msg.content + text }
                        : msg
                ));
            }
        }
    };

    const handleNewChat = async (message: string) => {
        setInput("");
        try {
            const response = await api.post("/api/assistant/create", { message });
            const { chatRoomId } = response.data;
            navigation.navigate("AssistantChatScreen", { 
                id: chatRoomId, 
                firstMessage: message 
            });
        } catch(error: any) {
            Alert.alert("Virhe", error.response?.data?.message || "Uuden chatin luominen epäonnistui");
        }
    };

    const fetchChatMessages = async (id: string) => {
        try {
            const response = await api.get(`/api/assistant/${id}`);
            setMessages(response.data.messages)
        } catch(error: any) {
            Alert.alert("Virhe", "Viesti historian hakeminen epäonnistui");
        }
    };

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await api.get("/api/assistant");
                setRecentChats(response.data.chatRooms);
            } catch(error: any) {
                Alert.alert("Virhe", "Chattien hakeminen epäonnistui");
            }
        };
        fetchChatHistory();
    }, [])
    
    const suggestions = [
        "Paljonko kulutin tässä kuussa?",
        "Näytä alv-yhteenveto",
        "Luokittele viimeisin kuitti",
    ];

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: historyOpen ? 0 : -SIDEBAR_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start()
    }, [historyOpen]);

    const backdropOpacity = slideAnim.interpolate({
        inputRange: [-SIDEBAR_WIDTH, 0],
        outputRange: [0, 0.4],
    });

    const handleNavigateToChat = async (id: string) => {
        navigation.navigate("AssistantChatScreen", { id });
        setHistoryOpen(false);
    };

    const handleNavigateToMain = () => {
        navigation.navigate("Main", { screen: "Assistant" });
        setMessages([]);
        setHistoryOpen(false);
    };

    return {
        SIDEBAR_WIDTH, insets,
        input, setInput,
        historyOpen, setHistoryOpen,
        slideAnim, recentChats,
        suggestions, backdropOpacity,
        handleNavigateToChat, messages,
        handleNavigateToMain, fetchChatMessages,
        handleSend, handleNewChat
    };
};