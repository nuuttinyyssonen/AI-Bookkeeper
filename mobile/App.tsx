import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from "./context/authContext";

import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import ReceiptViewScreen from "./screens/main/ReceiptViewScreen";
import AssistantChatScreen from "./screens/main/AssistantChatScreen";
import AccountDeletedScreen from "./screens/main/AccountDeletedScreen";

import MainTabNavigator from "./navigation/MainTabNavigator";

import Toast from 'react-native-toast-message';

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
                    <Stack.Screen name="AssistantChatScreen" component={AssistantChatScreen} />
                    <Stack.Screen name="AccountDeletedScreen" component={AccountDeletedScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="ForgotPasswordForm" component={ForgotPasswordScreen} />
                    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <NavigationContainer>
                    <RootNavigator />
                </NavigationContainer>
                <Toast/>
            </AuthProvider>
        </SafeAreaProvider>
    );
};