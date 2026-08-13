import { View, Text } from "react-native";

export default function DraftBanner({ children }: { children: React.ReactNode }) {
    return (
        <View className="mb-6 gap-1 rounded-lg border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900 p-4">
            <Text className="text-sm leading-6 text-amber-800 dark:text-amber-100">{children}</Text>
        </View>
    );
};
