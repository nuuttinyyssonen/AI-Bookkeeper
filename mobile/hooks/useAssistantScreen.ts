import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { Dimensions, Animated, Alert } from "react-native";
import { UseAssistantScreenReturn } from "../types/assistant";
import { Message } from "../types/assistant";
import api from "../services/api";

export const useAssistantScreen = ({ navigation }: any): UseAssistantScreenReturn => {
    const SIDEBAR_WIDTH = Math.min(300, Dimensions.get("window").width * 0.8)

    const [input, setInput] = useState("")
    const [historyOpen, setHistoryOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([]);
    const [recentChats, setRecentChats] = useState([]);

    const insets = useSafeAreaInsets()
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current

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
        await fetchChatMessages(id);
        navigation.navigate("AssistantChatScreen", { id });
        setHistoryOpen(false);
    };

    const handleNavigateToMain = () => {
        navigation.navigate("Main", { screen: "Assistant" });
        setHistoryOpen(false);
    };

    return {
        SIDEBAR_WIDTH, insets,
        input, setInput,
        historyOpen, setHistoryOpen,
        slideAnim, recentChats,
        suggestions, backdropOpacity,
        handleNavigateToChat, messages,
        handleNavigateToMain
    };
};