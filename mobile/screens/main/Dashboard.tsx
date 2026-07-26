import { View, Text, TouchableOpacity } from "react-native"
import { useAuth } from "../../context/authContext";

export default function Dashboard({ navigation }: any) {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return(
        <View>
            <Text>This is dashboard</Text>
            <TouchableOpacity onPress={handleLogout} className="h-11 items-center justify-center rounded-lg bg-slate-950">
                <Text className="text-sm font-semibold text-white">Kirjaudu ulos</Text>
            </TouchableOpacity>
        </View>
    )
}