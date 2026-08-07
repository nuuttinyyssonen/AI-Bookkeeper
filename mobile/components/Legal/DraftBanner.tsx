import { View, Text } from "react-native";

export default function DraftBanner({ children }: { children: React.ReactNode }) {
    return (
        <View className="mb-6 gap-1 rounded-lg border border-amber-300 bg-amber-50 p-4">
            <Text className="text-sm leading-6 text-amber-800">{children}</Text>
        </View>
    );
};
