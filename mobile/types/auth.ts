export type Plan = "BASIC" | "PREMIUM";

export type UseSignupReturn = {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    passwordRepeat: string;
    setPasswordRepeat: (value: string) => void;
    first_name: string;
    setFirst_name: (value: string) => void;
    last_name: string;
    setLast_name: (value: string) => void;
    phonenumber: string;
    setPhonenumber: (value: string) => void;
    business_id: string;
    setBusiness_id: (value: string) => void;
    checked: boolean;
    setChecked: (value: boolean) => void;
    selectedPlan: Plan;
    setSelectedPlan: (value: Plan) => void;
    handleSignup: () => Promise<void>;
};

export type UseLoginReturn = {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    handleLogin: () => Promise<void>;
};