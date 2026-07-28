import { View } from "react-native";

export default function ReceiptViewScreen({ navigation, route }: any) {
    const { id } = route.params;
    console.log("Receipt id:", id)
    return (
        <View>

        </View>
    )
};