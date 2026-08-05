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

export type SubscriptionType = "BASIC" | "PREMIUM" | "BASIC_YEARLY" | "PREMIUM_YEARLY";

export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE";

export type SubscriptionData = {
    subscription_type: SubscriptionType;
    subscription_status: SubscriptionStatus;
    current_period_start?: string | null;
    current_period_end?: string | null;
    cancel_at_period_end: boolean;
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
    handleDeleteUser: () => void;
    confirmationInput: string;
    setConfirmationInput: (value: string) => void;
    isDeletingUser: boolean;
    subscription: SubscriptionData | null;
    isConfirmingCancelSubscription: boolean;
    setIsConfirmingCancelSubscription: (value: boolean) => void;
    isCancellingSubscription: boolean;
    handleCancelSubscription: () => void;
    isConfirmingReactivateSubscription: boolean;
    setIsConfirmingReactivateSubscription: (value: boolean) => void;
    isReactivatingSubscription: boolean;
    handleReactivateSubscription: () => void;
};