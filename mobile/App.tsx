import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importing Components
import LoginForm from "./screens/auth/LoginForm";
import SignupForm from "./screens/auth/SignupForm";
import PasswordResetForm from "./screens/auth/PasswordResetForm";

// Create stack outside of App
const Stack = createNativeStackNavigator();

export default function App() {
  
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginForm}/>
                <Stack.Screen name="Signup" component={SignupForm}/>
                <Stack.Screen name="PasswordReset" component={PasswordResetForm}/>
            </Stack.Navigator>
        </NavigationContainer> 
    );
}
