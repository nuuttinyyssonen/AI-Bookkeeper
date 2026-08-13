import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
    handleDeductibleToggle: () => void;
    isDeductible: boolean;
    deductiblePercentage: number;
    handleDeductiblePercentageChange: (value: number) => void | Promise<void>;
}

const PRESETS = [50, 100];

export default function Deductible({
    handleDeductibleToggle,
    isDeductible,
    deductiblePercentage,
    handleDeductiblePercentageChange,
}: Props) {
    const [customMode, setCustomMode] = useState(false);
    const [customValue, setCustomValue] = useState("");

    const isPreset = deductiblePercentage === 50 || deductiblePercentage === 100;

    const handlePreset = (pct: number) => {
        setCustomMode(false);
        setCustomValue("");
        handleDeductiblePercentageChange(pct);
    };

    const handleMuu = () => {
        setCustomMode(true);
        setCustomValue(isPreset ? "" : String(deductiblePercentage));
    };

    const handleCustomSubmit = () => {
        const parsed = parseInt(customValue, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
            handleDeductiblePercentageChange(parsed);
        } else {
            setCustomValue(isPreset ? "" : String(deductiblePercentage));
        }
    };

    return (
        <View className="gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3">
            <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">Vähennyskelpoinen</Text>
                <TouchableOpacity
                    onPress={handleDeductibleToggle}
                    className={`rounded-full px-4 py-1.5 ${isDeductible ? "bg-teal-600" : "bg-red-100 dark:bg-red-800"}`}
                >
                    <Text className={`text-sm font-medium ${isDeductible ? "text-white" : "text-red-700 dark:text-red-200"}`}>
                        {isDeductible ? "Kyllä" : "Ei"}
                    </Text>
                </TouchableOpacity>
            </View>

            {isDeductible && (
                <View className="flex-row flex-wrap items-center gap-2">
                    <Text className="shrink-0 text-xs text-slate-500 dark:text-slate-400">Osuus</Text>
                    {PRESETS.map((pct) => {
                        const isActive = !customMode && deductiblePercentage === pct;
                        return (
                            <TouchableOpacity
                                key={pct}
                                onPress={() => handlePreset(pct)}
                                className={`rounded-full px-3 py-1 ${
                                    isActive ? "bg-teal-600" : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                                }`}
                            >
                                <Text className={`text-xs font-medium ${isActive ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>
                                    {pct}%
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity
                        onPress={handleMuu}
                        className={`rounded-full px-3 py-1 ${
                            customMode ? "bg-teal-600" : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                        }`}
                    >
                        <Text className={`text-xs font-medium ${customMode ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>
                            Muu
                        </Text>
                    </TouchableOpacity>

                    {customMode && (
                        <View className="flex-row items-center gap-1">
                            <TextInput
                                autoFocus
                                keyboardType="number-pad"
                                value={customValue}
                                onChangeText={setCustomValue}
                                onBlur={handleCustomSubmit}
                                onSubmitEditing={handleCustomSubmit}
                                placeholder="0–100"
                                className="w-16 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1 text-xs text-slate-700 dark:text-slate-200"
                            />
                            <Text className="text-xs text-slate-500 dark:text-slate-400">%</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}
