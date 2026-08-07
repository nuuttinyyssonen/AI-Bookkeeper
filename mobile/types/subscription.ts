export type UseSubscriptionReturn = {
    isYearly: boolean;
    setIsYearly: (value: boolean) => void;
    handleChangePlan: (subscriptionType: string) => void;
    selectedPlan?: string | null;
    pendingPlanId: string | null;
};