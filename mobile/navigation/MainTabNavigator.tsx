import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import ReceiptScreen from "../screens/main/ReceiptScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import UploadScreen from "../screens/main/UploadScreen";
import AssistantScreen from "../screens/main/AssistantScreen";
import ReportScreen from "../screens/main/ReportScreen";
import DashboardScreen from "../screens/main/DashboardScreen";
import { useTheme } from "../context/themeContext";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    const icons: Record<string, string> = {
                        Dashboard: "home",
                        Receipts: "receipt",
                        Upload: "cloud-upload",
                        Reports: "bar-chart",
                        Assistant: "chatbubble",
                        Profile: "person",
                    };
                    return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: isDark ? "#f8fafc" : "#0f172a",
                tabBarInactiveTintColor: isDark ? "#64748b" : "#94a3b8",
                tabBarStyle: {
                    backgroundColor: isDark ? "#020617" : "#ffffff",
                    borderTopColor: isDark ? "#1e293b" : "#e2e8f0",
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Receipts" component={ReceiptScreen} />
            <Tab.Screen name="Upload" component={UploadScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Reports" component={ReportScreen} />
            <Tab.Screen name="Assistant" component={AssistantScreen} />
        </Tab.Navigator>
    );
}