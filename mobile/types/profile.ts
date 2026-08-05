import { Dispatch, SetStateAction } from "react";

export type ProfileInformationType = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    businessId: string;
};

export type Payment = {
    amount: string;
    date: string;
    description: string;
    status: string
};

export type UseProfileReturn = {
    isEditingInformation: boolean;
    setIsEditingInformation: (value: boolean) => void;
    information: ProfileInformationType;
    setInformation: Dispatch<SetStateAction<ProfileInformationType>>;
    handleCancelInformation: () => void;
    handleUpdateInformation: () => void;
    isLoading: boolean;
    paymentHistory: Payment[];
};