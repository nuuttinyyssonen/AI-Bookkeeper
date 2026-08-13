import { ScrollView } from "react-native"
import { useSignup } from "../../hooks/useSignup"
import SignupForm from "../../components/Signup/SignupForm";

export default function SignupScreen({ navigation }: any) {
    const signup = useSignup(navigation);

    return(
        <ScrollView
            className="flex-1 bg-slate-50 dark:bg-slate-900"
            contentContainerClassName="flex-grow justify-center px-4 py-8"
            keyboardShouldPersistTaps="handled"
        >
            <SignupForm {...signup}/>
        </ScrollView>
    )
};