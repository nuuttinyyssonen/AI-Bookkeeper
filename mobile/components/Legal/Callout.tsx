import { View, Text } from "react-native";

type CalloutProps = {
    label: string;
    children: React.ReactNode;
};

export default function Callout({ label, children }: CalloutProps) {
    return (
        <View className="gap-1 rounded-lg border border-teal-200 bg-teal-50 dark:bg-teal-900 p-4">
            <Text className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200">{label}</Text>
            {children}
        </View>
    );
};
