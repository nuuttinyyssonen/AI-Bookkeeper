import "./global.css";
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from "./context/authContext";
import { ThemeProvider, useTheme } from "./context/themeContext";

import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import ReceiptViewScreen from "./screens/main/ReceiptViewScreen";
import ReportViewScreen from "./screens/main/ReportViewScreen";
import AssistantChatScreen from "./screens/main/AssistantChatScreen";
import AccountDeletedScreen from "./screens/main/AccountDeletedScreen";
import SubscriptionPlansScreen from "./screens/main/SubscriptionPlansScreen";
import PrivacyPolicyScreen from "./screens/main/PrivacyPolicyScreen";
import TermsOfServiceScreen from "./screens/main/TermsOfServiceScreen";

import MainTabNavigator from "./navigation/MainTabNavigator";

import Toast from 'react-native-toast-message';

import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { usePushNotifications } from "./hooks/usePushNotifications";


const Stack = createNativeStackNavigator();

function RootNavigator() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) return null;

    return (
        <Stack.Navigator>
            {isAuthenticated ? (
                <>
                    <Stack.Screen name="Main" component={MainTabNavigator} />
                    <Stack.Screen name="ReceiptView" component={ReceiptViewScreen} />
                    <Stack.Screen name="ReportView" component={ReportViewScreen} />
                    <Stack.Screen name="AssistantChatScreen" component={AssistantChatScreen} />
                    <Stack.Screen name="AccountDeletedScreen" component={AccountDeletedScreen} />
                    <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="ForgotPasswordForm" component={ForgotPasswordScreen} />
                    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                </>
            )}
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
        </Stack.Navigator>
    );
};

function AppContent() {
    const { resolvedTheme } = useTheme();
    const { isAuthenticated } = useAuth();
    const { registerForPushNotifications } = usePushNotifications();
    const navigationRef = useRef<any>(null);

    useEffect(() => {
        if (isAuthenticated) {
            registerForPushNotifications();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const screen = response.notification.request.content.data?.screen;
            if (screen) {
                navigationRef.current?.navigate(screen);
            }
        });

        return () => responseSubscription.remove();
    }, []);

    return (
        <>
            <NavigationContainer ref={navigationRef} theme={resolvedTheme === "dark" ? DarkTheme : DefaultTheme}>
                <RootNavigator />
            </NavigationContainer>
            <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
            <Toast/>
        </>
    );
}


export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
};
