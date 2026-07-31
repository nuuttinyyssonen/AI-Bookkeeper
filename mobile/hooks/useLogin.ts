import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/authContext";
import { Alert } from "react-native";
import { UseLoginReturn } from "../types/auth";

export const useLogin = (): UseLoginReturn => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await api.post('/api/auth/login', {
                email,
                password
            });
            await login(response.data.user.token);
        } catch(error: any) {
            Alert.alert("Virhe", error.response?.data?.message || "Kirjautuminen epäonnistui");
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        handleLogin
    }
};