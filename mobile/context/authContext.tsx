import { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await SecureStore.getItemAsync("token");
            setIsAuthenticated(!!token);
        };
        checkAuth();
    }, []);

    const logout = async () => {
        await SecureStore.deleteItemAsync("token");
        setIsAuthenticated(false);
    };

    const login = async (token: string) => {
        await SecureStore.setItemAsync("token", token);
        setIsAuthenticated(true);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);