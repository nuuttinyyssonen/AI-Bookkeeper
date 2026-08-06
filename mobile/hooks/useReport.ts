import { useState, useEffect } from "react";
import { Report } from "../types/report";
import { Alert } from "react-native";
import api from "../services/api";
import { UseReportReturn } from "../types/report";

export const useReport = (): UseReportReturn => {
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get("/api/report");
                setReports(response.data.reports);
            } catch(error: any) {
                Alert.alert("Virhe", "Raporttien hakeminen epäonnistui");
            }
        };
        fetchReports();
    }, []);

    const handleCreateReport = async (timePeriod: string) => {
        try {
            const response = await api.post("/api/report", { timePeriod });
            setReports((prev) => {
                const exists = prev.findIndex((r) => r.id === response.data.id);
                if (exists !== -1) {
                    return prev.map((r) => r.id === response.data.id ? response.data : r);
                }
                return [...prev, response.data];
            });
        } catch(error: any) {
            Alert.alert("Virhe", "Raportin luominen epäonnistui");
        }
    };

    return {
        reports,
        handleCreateReport
    }
};