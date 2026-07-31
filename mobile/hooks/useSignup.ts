import { useState } from "react";
import { Alert } from "react-native";
import api from "../services/api";
import * as WebBrowser from "expo-web-browser";
import { Plan } from "../types/auth";
import { UseSignupReturn } from "../types/auth";

export const useSignup = (navigation: any): UseSignupReturn => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [business_id, setBusiness_id] = useState("");
    const [checked, setChecked] = useState(false);    
    const [selectedPlan, setSelectedPlan] = useState<Plan>("BASIC");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        if(!checked) {
            return Alert.alert("Käyttehtoja ja tietosuojaselostetta ei ole hyväksytty!");
        }

        // Validating that all fields are used
        if (!email || !password || !passwordRepeat || !last_name || !first_name || !phonenumber || !business_id) {
            return Alert.alert("Kaikki kentät vaaditaan käyttäjän luomiseen");
        }

        // Validating passwords
        if (password !== passwordRepeat) {
            return Alert.alert("Salasanat eivät täsmää");
        }

        let user_id: string = "";
        setIsLoading(true);
        try {
            const response = await api.post('/api/auth/signup', {
                email,
                password,
                first_name,
                last_name,
                phonenumber,
                business_id
            });

            user_id = response.data.id;

            const checkout_response = await api.post('/api/subscription/create-checkout-session', {
                subscriptionType: selectedPlan,
                user_id,
                platform: 'mobile'
            });
            const checkoutUrl = checkout_response.data.url;

            // Stripe redirects back into the app via the "aibookkeeper" deep link
            // (checkout-success / checkout-cancel) set up on the server side
            const result = await WebBrowser.openAuthSessionAsync(checkoutUrl, 'aibookkeeper://checkout');

            if (result.type !== 'success' || !result.url?.startsWith('aibookkeeper://checkout-success')) {
                await api.delete(`/api/auth/signup/${user_id}`, { data: { id: user_id } });
                return Alert.alert("Peruutettu", "Rekisteröityminen peruutettu");
            }

            try {
                // Webhook may take a moment to mark the subscription active after the redirect fires
                let hasSubscription = false;
                for (let attempt = 0; attempt < 3 && !hasSubscription; attempt++) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    const response = await api.get(`/api/subscription/status/${user_id}`);
                    hasSubscription = response.data.hasSubscription;
                }

                if (hasSubscription) {
                    navigation.navigate("Login");
                    Alert.alert("Onnistui", "Tilisi on aktivoitu. Kirjaudu sisään.");
                } else {
                    await api.delete(`/api/auth/signup/${user_id}`, { data: { id: user_id } });
                    Alert.alert("Peruutettu", "Rekisteröityminen peruutettu");
                }
            } catch(error: any) {
                Alert.alert("Virhe", "Virhe tapahtui");
            }
        } catch(error: any) {
            if(user_id) {
                try {
                    await api.delete(`/api/auth/signup/${user_id}`, { data: { id: user_id } });
                } catch(deleteError: any) {
                    console.log("Delete error:", deleteError.response?.data);
                }
            }
            Alert.alert("Virhe", error.response?.data?.message || "Virhe luodessa käyttäjää");    
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        passwordRepeat, setPasswordRepeat,
        first_name, setFirst_name,
        last_name, setLast_name,
        phonenumber, setPhonenumber,
        business_id, setBusiness_id,
        checked, setChecked,
        selectedPlan, setSelectedPlan,
        handleSignup, isLoading
    }
};