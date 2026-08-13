import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

type LegalHeaderProps = {
    eyebrow: string;
    title: string;
    description: string;
    meta?: React.ReactNode;
};

export default function LegalHeader({ eyebrow, title, description, meta }: LegalHeaderProps) {
    const navigation = useNavigation<any>();

    return (
        <View className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-sm text-slate-500 dark:text-slate-400">← Takaisin</Text>
            </TouchableOpacity>
            <Text className="mt-1 text-sm font-medium text-teal-700 dark:text-teal-200">{eyebrow}</Text>
            <Text className="text-2xl font-semibold text-slate-950 dark:text-slate-50">{title}</Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</Text>
            {meta}
        </View>
    );
};
