import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from "./context/authContext";

import LoginForm from "./screens/auth/LoginForm";
import SignupForm from "./screens/auth/SignupForm";
import PasswordResetForm from "./screens/auth/PasswordResetForm";
import Dashboard from "./screens/main/Dashboard";

const Stack = createNativeStackNavigator();

function RootNavigator() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) return null;

    return (
        <Stack.Navigator>
            {isAuthenticated ? (
                <Stack.Screen name="Dashboard" component={Dashboard} />
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginForm} />
                    <Stack.Screen name="Signup" component={SignupForm} />
                    <Stack.Screen name="PasswordResetForm" component={PasswordResetForm} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
};