import { Text } from "react-native";

export default function FillMe({ children }: { children: React.ReactNode }) {
    return <Text className="italic text-amber-700 dark:text-amber-200">{children}</Text>;
};
