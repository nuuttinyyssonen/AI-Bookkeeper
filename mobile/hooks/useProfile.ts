import { useState } from "react";
import { UseProfileReturn } from "../types/profile";

const initialInformation = {
    firstName: "Matti",
    lastName: "Meikäläinen",
    email: "matti.meikalainen@example.com",
    phoneNumber: "+358 40 123 4567",
    businessId: "1234567-8",
}

export const useProfile = (): UseProfileReturn => {
    const [isEditingInformation, setIsEditingInformation] = useState(false);
    const [information, setInformation] = useState(initialInformation);

    const handleCancelInformation = () => {
        setInformation(initialInformation)
        setIsEditingInformation(false)
    };

    return {
        isEditingInformation, setIsEditingInformation,
        information, setInformation,
        handleCancelInformation
    };
};