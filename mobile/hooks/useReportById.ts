import { useState, useEffect } from "react";
import { Report } from "../types/report";
import { Alert } from "react-native";
import api from "../services/api";
import { UseReportByIdReturn } from "../types/report";
import Toast from "react-native-toast-message";

export const useReportById = (id: string, navigation: any): UseReportByIdReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<Report>({
        id: "",
        period_start: "",
        period_end: "",
        period_type: "",
        vat_declaration_sent: false,
        sales_vat_amount: "0",
        purchase_vat_amount: "0",
        vat_payable: "0",
        created_at: "",
        sales_net: "0",
        purchase_net: "0",
        sales_gross: "0",
        purchase_gross: "0",
        vat_breakdown: { sales: [], purchases: [] },
        pdf_path: null,
    });

    useEffect(() => {
        const fetchReport = async () => {
            setIsLoading(true)
            try {
                const response = await api.get(`/api/report/${id}`);
                setReport(response.data);
            } catch(error: any) {
                Alert.alert("Virhe", "Raportin hakeminen epäonnistui");
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, []);

    const handleDeleteReport = async () => {
        Alert.alert(
            "Poista raportti",
            "Haluatko varmasti poistaa raportin?",
            [
                { text: "Peruuta", style: "cancel" },
                {
                    text: "Poista",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/api/report/${id}`);
                            Toast.show({
                                type: "success",
                                text1: "Onnistui",
                                text2: "Raportti poistettiin onnistuneesti"
                            });
                            navigation.goBack();
                        } catch(error: any) {
                            Alert.alert("Virhe", "Raportin poistaminen epäonnistui");
                        }
                    }
                }
            ]
        );
    };

    const handleUpdateReport = async () => {
        try {
            await api.put(`/api/report/${id}/declaration-sent`);
            setReport((prev) => ({ ...prev, vat_declaration_sent: true }));
            Toast.show({
                type: "success",
                text1: "Onnistui",
                text2: "Raportti päivitettiin onnistuneesti"
            });
        } catch(error: any) {
            Alert.alert("Virhe", "Raportin päivitys epäonnistui");
        }
    };

    return {
        report, isLoading, handleDeleteReport,
        handleUpdateReport
    };
};