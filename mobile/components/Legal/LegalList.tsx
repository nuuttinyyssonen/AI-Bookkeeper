import { View, Text } from "react-native";

export default function LegalList({ items }: { items: string[] }) {
    return (
        <View className="gap-2">
            {items.map((item) => (
                <View key={item} className="flex-row gap-2">
                    <Text className="text-sm leading-6 text-slate-600 dark:text-slate-300">•</Text>
                    <Text className="flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item}</Text>
                </View>
            ))}
        </View>
    );
};
