import { View, Text, TextInput, TouchableOpacity } from "react-native"
import PlanSelector from "./PlanSelector"
import { UseSignupReturn } from "../../types/auth"
import { useNavigation } from "@react-navigation/native"

export default function SignupForm({selectedPlan, setSelectedPlan, setEmail, email,
    setFirst_name, first_name, setLast_name, last_name, setPhonenumber, phonenumber,
    setBusiness_id, business_id, password, setPassword, setPasswordRepeat, passwordRepeat,
    checked, setChecked, handleSignup, isLoading
}: UseSignupReturn) {
    const navigation = useNavigation<any>();
    return (
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
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                        onPress={() => setChecked(!checked)}
                        className={`h-5 w-5 rounded border-2 items-center justify-center ${checked ? 'bg-slate-950 border-slate-950' : 'border-slate-300'}`}
                    >
                        {checked && <Text className="text-white text-xs">✓</Text>}
                    </TouchableOpacity>
                    <Text className="flex-1 text-sm text-slate-600">
                        Hyväksyn{" "}
                        <Text
                            className="font-semibold text-teal-700"
                            onPress={() => navigation.navigate("TermsOfService")}
                        >
                            käyttöehdot
                        </Text>{" "}
                        ja{" "}
                        <Text
                            className="font-semibold text-teal-700"
                            onPress={() => navigation.navigate("PrivacyPolicy")}
                        >
                            tietosuojaselosteen
                        </Text>
                    </Text>
                </View>
                <TouchableOpacity onPress={handleSignup}
                disabled={isLoading} 
                className={`h-11 items-center justify-center rounded-lg bg-slate-950 ${isLoading ? "opacity-60" : ""}`}
                >
                    <Text className="text-sm font-semibold text-white">
                        {isLoading ? "Luodaan tiliä..." : "Luo tili"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text className="text-center text-sm leading-6 text-slate-500">
                        Onko sinulla jo tili? <Text className="font-semibold text-teal-700">Kirjaudu sisään</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}