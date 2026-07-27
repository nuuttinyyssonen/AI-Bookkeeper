import { View, Text, TouchableOpacity, Alert } from "react-native"
import { useAuth } from "../../context/authContext";
import { useEffect } from "react";
import api from "../../services/api";

export default function Dashboard({ navigation }: any) {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    useEffect(() => {
        const fetchUserData = async() => {
            try {
                const response = await api.get("/api/dashboard");
                console.log(response.data);
            } catch(error: any) {
                return Alert.alert("Virhe", "Käyttäjän datan hakeminen epäonnistui");
            }
        };
        fetchUserData();
    }, []);

    return(
        <View>
            <Text>This is dashboard</Text>
            <TouchableOpacity onPress={handleLogout} className="h-11 items-center justify-center rounded-lg bg-slate-950">
                <Text className="text-sm font-semibold text-white">Kirjaudu ulos</Text>
            </TouchableOpacity>
        </View>
    )
}