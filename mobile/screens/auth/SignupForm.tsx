import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native"
import { useState } from "react"
import PlanSelector, { Plan } from "./components/PlanSelector"
import api from "../../services/api";
import * as WebBrowser from "expo-web-browser";

export default function SignupForm({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [business_id, setBusiness_id] = useState("");

    const [checked, setChecked] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan>("BASIC");

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

            if (result.type !== 'success' || !result.url.startsWith('aibookkeeper://checkout-success')) {
                await api.delete(`/api/auth/signup/${user_id}`);
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
                    await api.delete(`/api/auth/signup/${user_id}`);
                    Alert.alert("Peruutettu", "Rekisteröityminen peruutettu");
                }
            } catch(error: any) {
                Alert.alert("Virhe", "Virhe tapahtui");
            }
        } catch(error: any) {
            if(user_id) {
                await api.delete(`/api/auth/signup/${user_id}`)
            }
            Alert.alert("Virhe", error.response.data?.message || "Virhe luodessa käyttäjää");    
        }
    };

    return(
        <ScrollView
            className="flex-1 bg-slate-50"
            contentContainerClassName="flex-grow justify-center px-4 py-8"
            keyboardShouldPersistTaps="handled"
        >
            <View className="w-full gap-6 rounded-lg border border-slate-200 bg-white py-6 shadow-xl shadow-slate-950/10">
                <View className="gap-2 px-6">
                    <Text className="text-2xl font-semibold text-slate-950">Luo tili</Text>
                    <Text className="text-sm leading-6 text-slate-500">Syötä tietosi luodaksesi tili</Text>
                </View>
                <View className="gap-4 px-6">
                    <PlanSelector selectedPlan={selectedPlan} onSelect={setSelectedPlan} />
                    <Text>Sähköposti</Text>
                    <TextInput
                        onChangeText={setEmail}
                        value={email}
                        placeholder="m@example.com"
                        autoComplete="email"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <Text>Etunimi</Text>
                    <TextInput
                        onChangeText={setFirst_name}
                        value={first_name}
                        placeholder="Matti"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <Text>Sukunimi</Text>
                    <TextInput
                        onChangeText={setLast_name}
                        value={last_name}
                        placeholder="Meikäläinen"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <Text>Puhelinnumero</Text>
                    <TextInput
                        onChangeText={setPhonenumber}
                        value={phonenumber}
                        placeholder="0401234567"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <Text>Y-tunnus</Text>
                    <TextInput
                        onChangeText={setBusiness_id}
                        value={business_id}
                        placeholder="1234567-8"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <Text>Salasana</Text>
                    <TextInput
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Salasana"
                        secureTextEntry
                        autoComplete="password"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <Text>Vahvista salasana</Text>
                    <TextInput
                        onChangeText={setPasswordRepeat}
                        value={passwordRepeat}
                        placeholder="Vahvista salasana"
                        secureTextEntry
                        autoComplete="password"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <TouchableOpacity 
                        onPress={() => setChecked(!checked)}
                        className="flex-row items-center gap-2"
                    >
                        <View className={`h-5 w-5 rounded border-2 items-center justify-center ${checked ? 'bg-slate-950 border-slate-950' : 'border-slate-300'}`}>
                            {checked && <Text className="text-white text-xs">✓</Text>}
                        </View>
                        <Text className="text-sm text-slate-600">Hyväksyn käyttöehdot ja tietosuojaselosteen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSignup} className="h-11 items-center justify-center rounded-lg bg-slate-950">
                        <Text className="text-sm font-semibold text-white">Luo tili</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text className="text-center text-sm leading-6 text-slate-500">
                            Onko sinulla jo tili? <Text className="font-semibold text-teal-700">Kirjaudu sisään</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
};