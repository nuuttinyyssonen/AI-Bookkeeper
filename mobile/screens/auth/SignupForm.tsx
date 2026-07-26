import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native"
import { useState } from "react"
import PlanSelector, { Plan } from "./components/PlanSelector"

export default function SignupForm({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checked, setChecked] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan>("BASIC");

    const handleSignup = () => {

    }

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
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Matti"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <Text>Sukunimi</Text>
                    <TextInput
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Meikäläinen"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <Text>Puhelinnumero</Text>
                    <TextInput
                        onChangeText={setEmail}
                        value={email}
                        placeholder="0401234567"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
                        placeholderTextColor="#94a3b8"
                    />
                    <Text>Y-tunnus</Text>
                    <TextInput
                        onChangeText={setEmail}
                        value={email}
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
                        onChangeText={setEmail}
                        value={email}
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