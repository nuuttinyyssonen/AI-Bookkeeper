import { View, Text } from "react-native";

type LegalTableProps = {
    headers: string[];
    rows: React.ReactNode[][];
};

export default function LegalTable({ headers, rows }: LegalTableProps) {
    return (
        <View className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <View className="flex-row bg-slate-50 dark:bg-slate-900">
                {headers.map((header) => (
                    <Text key={header} className="flex-1 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {header}
                    </Text>
                ))}
            </View>
            {rows.map((row, i) => (
                <View key={i} className="flex-row border-t border-slate-200 dark:border-slate-700">
                    {row.map((cell, j) => (
                        <View key={j} className="flex-1 px-3 py-2">
                            {typeof cell === "string" ? (
                                <Text className="text-sm leading-6 text-slate-600 dark:text-slate-300">{cell}</Text>
                            ) : (
                                cell
                            )}
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
};
