import { useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import api from "../services/api";
import { UsePasswordResetReturn } from "../types/auth";

export const usePasswordReset = (navigation: any, token?: string): UsePasswordResetReturn => {
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendEmail = async() => {
        if(!email) {
            return Alert.alert("Virhe", "Syötä sähköpostiosoite");
        }

        setIsLoading(true);
        try {
            const response = await api.post("/api/auth/reset-password/send-email", {
                email,
                platform: "mobile"
            });
            Toast.show({
                type: "success",
                text1: "Onnistui",
                text2: response.data.message
            });
            
            // Navigate only added for development environment.
            // In production environment navigation would happen from that is sent to email.
            navigation.navigate("ResetPassword", { token: response.data.token });
        } catch(error: any) {
            return Alert.alert(error.response.data?.message || "Virhe, Sähköpostilinkin lähetys epäonnistui");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async() => {
        if(!token) {
            return Alert.alert("Virhe", "Token puuttuu");
        }

        if(!password || !passwordRepeat) {
            return Alert.alert("Virhe", "Syötä molemmat kentät");
        }

        if(password !== passwordRepeat) {
            return Alert.alert("Virhe", "Salasanat eivät täsmää");
        }

        setIsLoading(true);
        try {
            const response = await api.post(`/api/auth/reset-password/${token}`, {
                password,
                passwordRepeat
            });
            Toast.show({
                type: "success",
                text1: "Onnistui",
                text2: response.data.message
            });

            navigation.navigate("Login");
        } catch(error: any) {
            return Alert.alert("Virhe", "Salasanan vaihtaminen epäonnistui");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        password, setPassword,
        passwordRepeat, setPasswordRepeat,
        email, setEmail,
        handleSendEmail, handleResetPassword,
        isLoading
    }
};