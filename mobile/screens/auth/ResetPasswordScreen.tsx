import { View} from "react-native"
import { usePasswordReset } from "../../hooks/usePasswordReset";
import ResetPasswordForm from "../../components/PasswordReset/ResetPasswordForm";

export default function ResetPasswordScreen({ navigation, route }: any) {
    const { token } = route.params;
    const passwordReset = usePasswordReset(navigation, token)

    return(
        <View className="flex-1 justify-center bg-slate-50 dark:bg-slate-900 px-4">
            <ResetPasswordForm {...passwordReset}/>
        </View>
    )
}