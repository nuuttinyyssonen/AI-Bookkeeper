import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { Dimensions, Animated } from "react-native";
import { UseAssistantScreenReturn } from "../types/assistant";
import { Message } from "../types/assistant";

export const useAssistantScreen = ({ navigation }: any): UseAssistantScreenReturn => {
    const SIDEBAR_WIDTH = Math.min(300, Dimensions.get("window").width * 0.8)

    const insets = useSafeAreaInsets()
    const [input, setInput] = useState("")
    const [historyOpen, setHistoryOpen] = useState(false)
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current
    
    const recentChats = [
        { id: "1", title: "Kuittien luokittelu", date: "3.8." },
        { id: "2", title: "Alv-vähennykset", date: "1.8." },
        { id: "3", title: "Kassavirtaraportti", date: "28.7." },
    ];

    const messages: Message[] = [
        { id: 1, role: "AI", content: "Hei Nuutti! Miten voin auttaa kirjanpidossasi tänään?" },
        { id: 2, role: "USER", content: "Paljonko olen käyttänyt ravintolakuluihin tässä kuussa?" },
        { id: 3, role: "AI", content: "Elokuussa ravintolakuluja on kirjattu yhteensä 214,50 €, yhteensä 6 kuitilta. Haluatko näkymän eriteltynä kuitti kerrallaan?" },
    ];
    
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

    const handleNavigateToChat = (id: string) => {
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