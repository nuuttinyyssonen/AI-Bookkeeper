import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

export type CategoryType =
    | "TOIMISTOKULUT"
    | "MATKAKULUT"
    | "EDUSTUSKULUT"
    | "ATERIA"
    | "MARKKINOINTI_JA_MAINONTA"
    | "KALUSTO_JA_LAITTEET"
    | "PALKKAKULUT_JA_PALKKIOT"
    | "VUOKRA"
    | "VAKUUTUKSET"
    | "PUHELIN_JA_TIETOLIIKENNE"
    | "OHJELMISTOT_JA_LISENSSIT"
    | "KOULUTUS_JA_KURSSIT"
    | "KIRJANPITO_JA_LAKIPALVELUT"
    | "PANKKIKULUT"
    | "AJONEUVOKULUT"
    | "KOTITOIMISTON_KULUT"
    | "YKSITYISOTOT"
    | "MUUT_KULUT"
    | "MYYNTI_TUOTTEET"
    | "MYYNTI_PALVELUT"
    | "MUUT_TULOT";

const CATEGORY_LABELS: Record<CategoryType, string> = {
    TOIMISTOKULUT: "Toimistokulut",
    MATKAKULUT: "Matkakulut",
    EDUSTUSKULUT: "Edustuskulut",
    ATERIA: "Ateria",
    MARKKINOINTI_JA_MAINONTA: "Markkinointi ja mainonta",
    KALUSTO_JA_LAITTEET: "Kalusto ja laitteet",
    PALKKAKULUT_JA_PALKKIOT: "Palkkakulut ja palkkiot",
    VUOKRA: "Vuokra",
    VAKUUTUKSET: "Vakuutukset",
    PUHELIN_JA_TIETOLIIKENNE: "Puhelin ja tietoliikenne",
    OHJELMISTOT_JA_LISENSSIT: "Ohjelmistot ja lisenssit",
    KOULUTUS_JA_KURSSIT: "Koulutus ja kurssit",
    KIRJANPITO_JA_LAKIPALVELUT: "Kirjanpito ja lakipalvelut",
    PANKKIKULUT: "Pankkikulut",
    AJONEUVOKULUT: "Ajoneuvokulut",
    KOTITOIMISTON_KULUT: "Kotitoimiston kulut",
    YKSITYISOTOT: "Yksityisotot",
    MUUT_KULUT: "Muut kulut",
    MYYNTI_TUOTTEET: "Myynti — tuotteet",
    MYYNTI_PALVELUT: "Myynti — palvelut",
    MUUT_TULOT: "Muut tulot",
};

const CATEGORY_TYPES = Object.keys(CATEGORY_LABELS) as CategoryType[];

interface Props {
    selectedCategory: string;
    handleCategoryChange: (category: string) => void;
}

export default function Categories({ selectedCategory, handleCategoryChange }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = CATEGORY_LABELS[selectedCategory as CategoryType];

    return (
        <View className="gap-1.5">
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">Kategoria</Text>

            <TouchableOpacity
                onPress={() => setIsOpen(true)}
                className="h-11 flex-row items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3"
            >
                <Text className={selectedLabel ? "text-sm text-slate-900 dark:text-slate-50" : "text-sm text-slate-400 dark:text-slate-500"}>
                    {selectedLabel ?? "Valitse kategoria"}
                </Text>
                <Text className="text-xs text-slate-400 dark:text-slate-500">▼</Text>
            </TouchableOpacity>

            <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
                <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setIsOpen(false)}>
                    <Pressable className="max-h-[70%] rounded-t-2xl bg-white dark:bg-slate-950 p-4">
                        <Text className="mb-2 px-2 text-base font-semibold text-slate-950 dark:text-slate-50">Valitse kategoria</Text>
                        <ScrollView>
                            {CATEGORY_TYPES.map((type) => {
                                const isSelected = selectedCategory === type;
                                return (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => {
                                            handleCategoryChange(type);
                                            setIsOpen(false);
                                        }}
                                        className={`rounded-lg px-3 py-3 ${isSelected ? "bg-teal-50 dark:bg-teal-900" : ""}`}
                                    >
                                        <Text className={isSelected ? "text-sm font-semibold text-teal-800 dark:text-teal-100" : "text-sm text-slate-700 dark:text-slate-200"}>
                                            {CATEGORY_LABELS[type]}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
