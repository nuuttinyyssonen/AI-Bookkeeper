import { useState, useEffect } from "react";
import { UseProfileReturn } from "../types/profile";
import api from "../services/api";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { ProfileInformationType, SubscriptionData } from "../types/profile";

export const useProfile = ({ navigation }: any): UseProfileReturn => {
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
    const [confirmationInput, setConfirmationInput] = useState("");
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [isConfirmingCancelSubscription, setIsConfirmingCancelSubscription] = useState(false);
    const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);
    const [isConfirmingReactivateSubscription, setIsConfirmingReactivateSubscription] = useState(false);
    const [isReactivatingSubscription, setIsReactivatingSubscription] = useState(false);

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

                setPaymentHistory(response.data.history);
                setSubscription(response.data.subscription);
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

    const handleDeleteUser = async () => {
        if(confirmationInput !== "DELETE") {
            return Alert.alert('Virhe, Syötä "DELETE" poistaaksesi käyttäjä');
        }
        Alert.alert(
            "Poista tili",
            "Haluatko varmasti poistaa tilisi? Tätä toimintoa ei voi peruuttaa.",
            [
                { text: "Peruuta", style: "cancel" },
                {
                    text: "Poista",
                    style: "destructive",
                    onPress: async () => {
                        setIsDeletingUser(true);
                        try {
                            await api.delete("/api/user");
                            navigation.navigate("AccountDeletedScreen");
                        } catch(error: any) {
                            Alert.alert("Virhe", "Käyttäjän poistaminen epäonnistui");
                        } finally {
                            setIsDeletingUser(false);
                        }
                    }
                }
            ]
        );
    };

    const handleCancelSubscription = async () => {
        setIsCancellingSubscription(true);
        try {
            await api.delete("/api/subscription/delete");
            setIsConfirmingCancelSubscription(false);
            setSubscription((prev) => prev ? { ...prev, cancel_at_period_end: true } : prev);

            Toast.show({
                type: "success",
                text1: "Onnistui",
                text2: "Tilaus peruutettu onnistuneesti"
            });
        } catch(error: any) {
            Alert.alert("Virhe", "Tilauksen peruuttaminen epäonnistui");
        } finally {
            setIsCancellingSubscription(false);
        }
    };

    const handleReactivateSubscription = async () => {
        setIsReactivatingSubscription(true);
        try {
            await api.put("/api/subscription/revoke-plan");
            setIsConfirmingReactivateSubscription(false);
            setSubscription((prev) => prev ? { ...prev, cancel_at_period_end: false, subscription_status: "ACTIVE" } : prev);

            Toast.show({
                type: "success",
                text1: "Onnistui",
                text2: "Tilaus aktivoitu uudelleen onnistuneesti"
            });
        } catch(error: any) {
            Alert.alert("Virhe", "Tilauksen uudelleenaktivointi epäonnistui");
        } finally {
            setIsReactivatingSubscription(false);
        }
    };

    return {
        isEditingInformation, setIsEditingInformation,
        information, setInformation,
        handleCancelInformation, handleUpdateInformation,
        isLoading, paymentHistory, handleDeleteUser, confirmationInput,
        setConfirmationInput, isDeletingUser, subscription,
        isConfirmingCancelSubscription, setIsConfirmingCancelSubscription,
        isCancellingSubscription, handleCancelSubscription,
        isConfirmingReactivateSubscription, setIsConfirmingReactivateSubscription,
        isReactivatingSubscription, handleReactivateSubscription
    };
};