import { View } from "react-native"
import { useLogin } from "../../hooks/useLogin";
import LoginForm from "../../components/Login/LoginForm";

export default function LoginScreen() {
    const login = useLogin();

    return(
        <View className="flex-1 justify-center bg-slate-50 px-4">
            <LoginForm {...login}/>
        </View>
    )
}