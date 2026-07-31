import { View } from "react-native"
import { usePasswordReset } from "../../hooks/usePasswordReset"
import ForgotPasswordForm from "../../components/PasswordReset/ForgotPasswordForm";

export default function ForgotPasswordScreen({ navigation }: any) {
    const passwordReset = usePasswordReset(navigation);

    return(
        <View className="flex-1 justify-center bg-slate-50 px-4">
            <ForgotPasswordForm {...passwordReset}/>
        </View>
    )
}