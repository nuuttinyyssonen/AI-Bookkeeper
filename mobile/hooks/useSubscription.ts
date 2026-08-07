import { useState, useEffect } from "react";
import { Alert } from "react-native";
import api from "../services/api";
import Toast from "react-native-toast-message";
import { UseSubscriptionReturn } from "../types/subscription";

export const useSubscription = (currentPlan?: string | null): UseSubscriptionReturn => {
    const [isYearly, setIsYearly] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null | undefined>(currentPlan);
    const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

    useEffect(() => {
        setSelectedPlan(currentPlan);
    }, [currentPlan]);

    const handleChangePlan = async (subscriptionType: string) => {
        Alert.alert(
            "Vaihda tilaus",
            "Haluatko varmasti vaihtaa tilauksesi? Maksu veloitetaan heti.",
            [
                { text: "Peruuta", style: "cancel" },
                {
                    text: "Vaihda",
                    onPress: async () => {
                        setPendingPlanId(subscriptionType);
                        try {
                            await api.put("/api/subscription/change-plan", { subscriptionType });
                            setSelectedPlan(subscriptionType);
                            Toast.show({
                                type: "success",
                                text1: "Onnistui",
                                text2: "Tilaus vaihdettiin onnistuneesti"
                            });
                        } catch(error: any) {
                            Alert.alert("Virhe", "Tilauksen vaihtaminen epäonnistui");
                        } finally {
                            setPendingPlanId(null);
                        }
                    }
                }
            ]
        );
    };

    return {
        isYearly, setIsYearly,
        handleChangePlan,
        selectedPlan,
        pendingPlanId,
    };
};