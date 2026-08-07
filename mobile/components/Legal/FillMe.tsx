import { Text } from "react-native";

export default function FillMe({ children }: { children: React.ReactNode }) {
    return <Text className="italic text-amber-700">{children}</Text>;
};
