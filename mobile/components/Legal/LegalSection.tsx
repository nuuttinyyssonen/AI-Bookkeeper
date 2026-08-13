import { View, Text } from "react-native";

type LegalSectionProps = {
    num: string;
    title: string;
    children: React.ReactNode;
};

export default function LegalSection({ num, title, children }: LegalSectionProps) {
    return (
        <View className="gap-3 border-b border-slate-200 dark:border-slate-700 py-6">
            <View className="flex-row items-baseline gap-2">
                <Text className="text-xs font-semibold text-teal-700 dark:text-teal-200">{num}</Text>
                <Text className="text-lg font-semibold text-slate-950 dark:text-slate-50">{title}</Text>
            </View>
            <View className="gap-3">{children}</View>
        </View>
    );
};
