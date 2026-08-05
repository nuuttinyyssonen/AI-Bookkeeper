import { useState, useEffect } from "react";
import { UseProfileReturn } from "../types/profile";
import api from "../services/api";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { ProfileInformationType } from "../types/profile";

export const useProfile = (): UseProfileReturn => {
    const [isEditingInformation, setIsEditingInformation] = useState(false);
    const [information, setInformation] = useState<ProfileInformationType>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        businessId: "",
    });
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleCancelInformation = () => {
        setIsEditingInformation(false)
    };

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get("/api/user");
                const user = response.data.user
                setInformation({
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    phoneNumber: user.phonenumber,
                    businessId: user.business_id,
                });
            } catch(error: any) {
                Alert.alert("Virhe", "Käyttäjä tietojen hakeminen epäonnistui");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [])

    const handleUpdateInformation = async () => {
        try {
            await api.put("/api/user", {
                first_name: information.firstName,
                last_name: information.lastName,
                email: information.email,
                phoneNumber: information.phoneNumber,
                business_id: information.businessId,
            });
            setIsEditingInformation(false);

            Toast.show({
                type: "success",
                text1: "Onnistui",
                text2: "Käyttäjä tiedot päivitettiin onnistuneesti"
            });
        } catch(error: any) {
            Alert.alert("Virhe", "Käyttäjä tietojen päivittäminen epäonnistui");
        }
    };

    return {
        isEditingInformation, setIsEditingInformation,
        information, setInformation,
        handleCancelInformation, handleUpdateInformation,
        isLoading
    };
};