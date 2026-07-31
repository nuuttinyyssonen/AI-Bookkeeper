import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import api from "../services/api";
import { Alert } from "react-native";
import { UseDashboardReturn } from "../types/dashboard";

export const useDashboard = (): UseDashboardReturn => {

    const { logout } = useAuth();
    const [revenue, setRevenue] = useState("");
    const [expenses, setExpenses] = useState("");
    const [netProfit, setNetProfit] = useState("");

    const [recentReceipts, setRecentReceipts] = useState([]);
    const [cashflow, setCashflow] = useState([]);

    const [subscriptionType, setSusbcriptionType] = useState("");

    const maxCashflowValue = Math.max(0, ...cashflow.map((item: any) => Math.max(Number(item.income), Number(item.expense))));
    const toPercent = (value: number) => maxCashflowValue === 0 ? 0 : Math.round((Number(value) / maxCashflowValue) * 100);

    const handleLogout = async () => {
        await logout();
    };

    useEffect(() => {
        const fetchUserData = async() => {
            try {
                // Fetching data for revenue, expenses, net_profit and recent_receipts
                const response = await api.get("/api/dashboard");
                setRevenue(response.data.revenue._sum.total_amount);
                setExpenses(response.data.expenses._sum.total_amount);
                setNetProfit(response.data.net_profit);
                setRecentReceipts(response.data.recent_receipts);

                // Cashflow
                const cashflow_response = await api.get('/api/dashboard/cashflow');
                setCashflow(cashflow_response.data.cashflow)

                // Subscription status
                const subscription_status_response = await api.get('/api/user/subscription');
                setSusbcriptionType(subscription_status_response.data.subscription.subscription_type);

            } catch(error: any) {
                return Alert.alert("Virhe", "Käyttäjän datan hakeminen epäonnistui");
            }
        };
        fetchUserData();
    }, []);

    return {
        handleLogout, subscriptionType,
        revenue, expenses,
        netProfit, cashflow,
        toPercent, recentReceipts
    }
};