import { EdgeInsets } from "react-native-safe-area-context";
import { Animated } from "react-native";

type RecentChat = {
    id: string;
    title: string;
    date: string;
};

export type Message = {
    id: number;
    role: "AI" | "USER";
    content: string;
};

export type ChatRoom = {
    id: string;
    title: string;
    created_at: string;
};

export type UseAssistantScreenReturn = {
    SIDEBAR_WIDTH: number;
    insets: EdgeInsets;
    input: string;
    setInput: (value: string) => void;
    historyOpen: boolean;
    setHistoryOpen: (value: boolean) => void;
    slideAnim: Animated.Value;
    recentChats: RecentChat[];
    suggestions: string[];
    backdropOpacity: Animated.AnimatedInterpolation<number>;
    handleNavigateToChat: (id: string) => void;
    messages: Message[];
    handleNavigateToMain: () => void;
};