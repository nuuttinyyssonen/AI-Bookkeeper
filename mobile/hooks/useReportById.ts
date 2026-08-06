import { useState, useEffect } from "react";
import { Report } from "../types/report";
import { Alert } from "react-native";
import api from "../services/api";
import { UseReportByIdReturn } from "../types/report";

export const useReportById = (id: string): UseReportByIdReturn => {
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

    return {
        report, isLoading
    }
};