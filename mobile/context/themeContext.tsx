import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { colorScheme, useColorScheme } from "nativewind";

type ThemePreference = "light" | "dark" | "system";

const THEME_KEY = "theme";

const ThemeContext = createContext<{
    preference: ThemePreference;
    resolvedTheme: "light" | "dark";
    setPreference: (value: ThemePreference) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [preference, setPreferenceState] = useState<ThemePreference>("system");
    const { colorScheme: resolvedTheme } = useColorScheme();

    useEffect(() => {
        const restore = async () => {
            const stored = await SecureStore.getItemAsync(THEME_KEY);
            if (stored === "light" || stored === "dark" || stored === "system") {
                setPreferenceState(stored);
                colorScheme.set(stored);
            }
        };
        restore();
    }, []);

    const setPreference = (value: ThemePreference) => {
        setPreferenceState(value);
        colorScheme.set(value);
        SecureStore.setItemAsync(THEME_KEY, value);
    };

    return (
        <ThemeContext.Provider value={{ preference, resolvedTheme: resolvedTheme ?? "light", setPreference }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
};
